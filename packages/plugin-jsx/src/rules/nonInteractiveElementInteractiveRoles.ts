import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

// cspell:disable -- ARIA role names are correct
// Non-interactive HTML elements
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

// Interactive ARIA roles
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

// Allowed role exceptions for specific elements
const allowedExceptions: Record<string, Set<string>> = {
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
		id: "nonInteractiveElementInteractiveRoles",
		preset: "logical",
	},
	messages: {
		invalidRole: {
			primary:
				"Non-interactive element <{{ element }}> cannot have interactive role '{{ role }}'.",
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

			// Find role attribute
			const roleAttr = element.attributes.properties.find(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "role",
			);

			if (!roleAttr || !ts.isJsxAttribute(roleAttr)) {
				return;
			}

			if (roleAttr.initializer && ts.isStringLiteral(roleAttr.initializer)) {
				const role = roleAttr.initializer.text;

				// Check if role is interactive
				if (!interactiveRoles.has(role)) {
					return;
				}

				// Check if this is an allowed exception
				if (allowedExceptions[elementName]?.has(role)) {
					return;
				}

				context.report({
					data: { element: elementName, role },
					message: "invalidRole",
					range: getTSNodeRange(roleAttr, context.sourceFile),
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
