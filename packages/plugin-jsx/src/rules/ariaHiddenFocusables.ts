import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const focusableElements = new Set([
	"a",
	"audio",
	"button",
	"input",
	"select",
	"textarea",
	"video",
]);

export default typescriptLanguage.createRule({
	about: {
		description: "Reports elements with aria-hidden='true' that are focusable.",
		// cspell:disable-next-line -- ariaHiddenFocusables is the rule name
		id: "ariaHiddenFocusables",
		preset: "logical",
	},
	messages: {
		ariaHiddenFocusable: {
			primary:
				'This element has `aria-hidden="true"` but is focusable, which can confuse screen reader users.',
			secondary: [
				"Elements with aria-hidden='true' should not be reachable via keyboard navigation.",
				"This creates confusion when users can focus elements they cannot perceive with a screen reader.",
				'Remove aria-hidden, make the element non-focusable (tabIndex="-1"), or restructure your component.',
			],
			suggestions: [
				'Remove aria-hidden="true"',
				'Add tabIndex="-1" to remove from focus order',
				"Use a non-focusable element",
			],
		},
	},
	setup(context) {
		function checkElement(
			tagName: ts.JsxTagNameExpression,
			attributes: ts.JsxAttributes,
		) {
			if (!ts.isIdentifier(tagName)) {
				return;
			}

			// Check if element has aria-hidden="true"
			const ariaHiddenAttr = attributes.properties.find((attr) => {
				if (!ts.isJsxAttribute(attr)) {
					return false;
				}

				return (
					ts.isIdentifier(attr.name) &&
					attr.name.text.toLowerCase() === "aria-hidden"
				);
			});

			if (!ariaHiddenAttr || !ts.isJsxAttribute(ariaHiddenAttr)) {
				return;
			}

			// Check if aria-hidden is set to "true"
			let isAriaHiddenTrue = false;
			if (ariaHiddenAttr.initializer) {
				if (ts.isStringLiteral(ariaHiddenAttr.initializer)) {
					isAriaHiddenTrue = ariaHiddenAttr.initializer.text === "true";
				} else if (ts.isJsxExpression(ariaHiddenAttr.initializer)) {
					const expr = ariaHiddenAttr.initializer.expression;
					if (expr && expr.kind === ts.SyntaxKind.TrueKeyword) {
						isAriaHiddenTrue = true;
					}
				}
			}

			if (!isAriaHiddenTrue) {
				return;
			}

			// Check if element is focusable
			const elementName = tagName.text.toLowerCase();

			// Check for tabIndex
			const tabIndexAttr = attributes.properties.find((attr) => {
				if (!ts.isJsxAttribute(attr)) {
					return false;
				}

				return (
					ts.isIdentifier(attr.name) &&
					attr.name.text.toLowerCase() === "tabindex"
				);
			});

			let tabIndexValue: number | undefined;
			if (tabIndexAttr && ts.isJsxAttribute(tabIndexAttr)) {
				if (
					tabIndexAttr.initializer &&
					ts.isStringLiteral(tabIndexAttr.initializer)
				) {
					tabIndexValue = Number(tabIndexAttr.initializer.text);
				} else if (
					tabIndexAttr.initializer &&
					ts.isJsxExpression(tabIndexAttr.initializer)
				) {
					const expr = tabIndexAttr.initializer.expression;
					if (expr && ts.isNumericLiteral(expr)) {
						tabIndexValue = Number(expr.text);
					}
				}
			}

			// If tabIndex is -1, element is not in focus order, so it's OK
			if (tabIndexValue === -1) {
				return;
			}

			// Check if element is inherently focusable or has positive tabIndex
			const isInherentlyFocusable = focusableElements.has(elementName);
			const hasPositiveTabIndex =
				tabIndexValue !== undefined && tabIndexValue >= 0;

			if (isInherentlyFocusable || hasPositiveTabIndex) {
				context.report({
					message: "ariaHiddenFocusable",
					range: getTSNodeRange(ariaHiddenAttr, context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkElement(node.tagName, node.attributes);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkElement(node.tagName, node.attributes);
				},
			},
		};
	},
});
