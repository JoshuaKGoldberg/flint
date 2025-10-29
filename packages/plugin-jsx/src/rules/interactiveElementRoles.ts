import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const interactiveElements = new Set([
	"a",
	"audio",
	"button",
	"details",
	"input",
	"select",
	"summary",
	"textarea",
	"video",
]);

const nonInteractiveRoles = new Set([
	"alert",
	"alertdialog",
	"application",
	"article",
	"banner",
	"cell",
	"complementary",
	"contentinfo",
	"definition",
	"dialog",
	"directory",
	"document",
	"feed",
	"figure",
	"form",
	"group",
	"heading",
	"img",
	"list",
	"listitem",
	"log",
	"main",
	"marquee",
	"math",
	"meter",
	"navigation",
	"none",
	"note",
	"presentation",
	"region",
	"rowgroup",
	"scrollbar",
	"search",
	"separator",
	"status",
	"table",
	"tabpanel",
	"term",
	"timer",
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
