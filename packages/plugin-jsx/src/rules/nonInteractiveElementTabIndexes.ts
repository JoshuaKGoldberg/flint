import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

// cspell:disable -- ARIA role names are correct
// Non-interactive elements that should not have positive/zero tabIndex
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
	"span",
	"ul",
]);

// Interactive roles that can have tabIndex
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

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports non-interactive elements with positive or zero tabIndex values.",
		id: "nonInteractiveElementTabIndexes",
		preset: "logical",
	},
	messages: {
		nonInteractiveTabIndex: {
			primary:
				"Non-interactive element <{{ element }}> should not have a tabIndex of {{ tabIndex }}.",
			secondary: [
				"Tab navigation should be limited to interactive elements.",
				"Non-interactive elements with tabIndex add unnecessary stops in the tab order.",
				"Use tabIndex='-1' if you need to programmatically focus the element.",
			],
			suggestions: [
				"Remove the tabIndex attribute",
				"Use tabIndex='-1' instead",
				"Add an interactive role to the element",
			],
		},
	},
	setup(context) {
		function getTabIndexValue(attr: ts.JsxAttribute): null | number {
			if (!attr.initializer) {
				return null;
			}

			// String literal: tabIndex="0"
			if (ts.isStringLiteral(attr.initializer)) {
				const value = parseInt(attr.initializer.text, 10);
				return isNaN(value) ? null : value;
			}

			// JSX expression: tabIndex={0}
			if (ts.isJsxExpression(attr.initializer)) {
				const expr = attr.initializer.expression;
				if (expr && ts.isNumericLiteral(expr)) {
					const value = parseInt(expr.text, 10);
					return isNaN(value) ? null : value;
				}
			}

			return null;
		}

		function getRoleValue(attributes: ts.JsxAttributes): null | string {
			const roleAttr = attributes.properties.find(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "role",
			);

			if (
				roleAttr &&
				ts.isJsxAttribute(roleAttr) &&
				roleAttr.initializer &&
				ts.isStringLiteral(roleAttr.initializer)
			) {
				return roleAttr.initializer.text;
			}

			return null;
		}

		function checkTabIndex(
			tagName: ts.JsxTagNameExpression,
			attributes: ts.JsxAttributes,
		) {
			if (!ts.isIdentifier(tagName)) {
				return;
			}

			const elementName = tagName.text.toLowerCase();

			// Skip if not a non-interactive element
			if (!nonInteractiveElements.has(elementName)) {
				return;
			}

			// Check if element has an interactive role
			const role = getRoleValue(attributes);
			if (role && interactiveRoles.has(role)) {
				return; // Interactive role makes it okay
			}

			// Find tabIndex attribute
			const tabIndexAttr = attributes.properties.find(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "tabIndex",
			);

			if (!tabIndexAttr || !ts.isJsxAttribute(tabIndexAttr)) {
				return;
			}

			const tabIndexValue = getTabIndexValue(tabIndexAttr);

			// Report if tabIndex is 0 or positive
			if (tabIndexValue !== null && tabIndexValue >= 0) {
				context.report({
					data: { element: elementName, tabIndex: String(tabIndexValue) },
					message: "nonInteractiveTabIndex",
					range: getTSNodeRange(tabIndexAttr, context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkTabIndex(node.tagName, node.attributes);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkTabIndex(node.tagName, node.attributes);
				},
			},
		};
	},
});
