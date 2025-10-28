import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const nonInteractiveElements = new Set([
	"article",
	"aside",
	"body",
	"br",
	"details",
	"div",
	"footer",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"header",
	"hr",
	"img",
	"li",
	"main",
	"nav",
	"ol",
	"p",
	"section",
	"table",
	"td",
	"ul",
]);

const interactiveRoles = new Set([
	"button",
	"checkbox",
	"link",
	"menuitem",
	"menuitemcheckbox",
	"menuitemradio",
	"option",
	"radio",
	"searchbox",
	"slider",
	"spinbutton",
	"switch",
	"tab",
	"textbox",
]);

const allowedExceptions: Record<string, Set<string> | undefined> = {
	li: new Set(["menuitem", "option", "row", "tab", "treeitem"]),
	ol: new Set([
		"listbox",
		"menu",
		"menubar",
		"radiogroup",
		"tablist",
		"tree",
		"treegrid",
	]),
	table: new Set(["grid"]),
	td: new Set(["gridcell"]),
	ul: new Set([
		"listbox",
		"menu",
		"menubar",
		"radiogroup",
		"tablist",
		"tree",
		"treegrid",
	]),
};

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports non-interactive elements with interactive ARIA roles.",
		id: "nonInteractiveElementRoles",
		preset: "logical",
	},
	messages: {
		invalidRole: {
			primary:
				"Non-interactive element <{{ element }}> should not have the interactive role `'{{ role }}'`.",
			secondary: [
				"Non-interactive elements should not be converted to interactive controls using ARIA roles.",
				"Use native interactive elements like <button> or <a> instead.",
				"This is required for WCAG 4.1.2 compliance.",
			],
			suggestions: [
				"Use a native interactive element instead",
				"Remove the role attribute",
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
			if (!nonInteractiveElements.has(elementName)) {
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

			if (
				interactiveRoles.has(role) &&
				!allowedExceptions[elementName]?.has(role)
			) {
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
