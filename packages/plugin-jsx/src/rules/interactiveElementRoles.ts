import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const interactiveElements = new Set([
	"a",
	"button",
	"input",
	"select",
	"textarea",
]);

const nonInteractiveRoles = new Set([
	"article",
	"banner",
	"complementary",
	"contentinfo",
	"form",
	"img",
	"list",
	"listitem",
	"main",
	"marquee",
	"navigation",
	"region",
	"status",
	"tooltip",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports interactive elements with non-interactive ARIA roles.",
		id: "interactiveElementRoles",
		preset: "logical",
	},
	messages: {
		invalidRole: {
			primary:
				"Interactive element <{{ element }}> should not have the non-interactive role `'{{ role }}'`.",
			secondary: [
				"Interactive elements should not be converted to non-interactive elements using ARIA roles.",
				"This removes expected browser interactions from the element.",
				"This is required for WCAG 4.1.2 compliance.",
			],
			suggestions: [
				"Remove the role attribute",
				"Use a native non-interactive element instead",
			],
		},
	},
	setup(context) {
		function checkElement(
			element: ts.JsxOpeningElement | ts.JsxSelfClosingElement,
		) {
			if (!ts.isIdentifier(element.tagName)) {
				return;
			}

			const elementName = element.tagName.text.toLowerCase();
			if (!interactiveElements.has(elementName)) {
				return;
			}

			const roleProperty = element.attributes.properties.find(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "role",
			);

			if (
				!roleProperty ||
				!ts.isJsxAttribute(roleProperty) ||
				!roleProperty.initializer ||
				!ts.isStringLiteral(roleProperty.initializer)
			) {
				return;
			}

			const role = roleProperty.initializer.text;

			if (nonInteractiveRoles.has(role)) {
				context.report({
					data: { element: elementName, role },
					message: "invalidRole",
					range: getTSNodeRange(roleProperty, context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkElement(node);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkElement(node);
				},
			},
		};
	},
});
