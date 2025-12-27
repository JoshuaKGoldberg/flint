import {
	getTSNodeRange,
	typescriptLanguage,
	TypeScriptServices,
} from "@flint.fyi/ts";
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
		id: "ariaHiddenFocusables",
		preset: "logical",
	},
	messages: {
		ariaHiddenFocusable: {
			primary:
				'This element has `aria-hidden="true"` but is focusable, which is misleading to users navigating with keyboards.',
			secondary: [
				"Elements with aria-hidden='true' should not be reachable via keyboard navigation.",
				"This creates confusion when users can focus elements they cannot perceive with a screen reader.",
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
			node: ts.JsxOpeningLikeElement,
			{ sourceFile }: TypeScriptServices,
		) {
			const { attributes, tagName } = node;
			if (!ts.isIdentifier(tagName)) {
				return;
			}

			const ariaHiddenProperty = attributes.properties.find(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text.toLowerCase() === "aria-hidden",
			);

			if (
				!ariaHiddenProperty ||
				!ts.isJsxAttribute(ariaHiddenProperty) ||
				!isAriaHiddenTrue(ariaHiddenProperty)
			) {
				return;
			}

			const tabIndexValue = findTabIndexValue(node);
			if (tabIndexValue === -1) {
				return;
			}

			if (
				focusableElements.has(tagName.text.toLowerCase()) ||
				(tabIndexValue !== undefined && tabIndexValue >= 0)
			) {
				context.report({
					message: "ariaHiddenFocusable",
					range: getTSNodeRange(ariaHiddenProperty, sourceFile),
				});
			}
		}

		return {
			visitors: {
				JsxOpeningElement: checkElement,
				JsxSelfClosingElement: checkElement,
			},
		};
	},
});

function findTabIndexValue(node: ts.JsxOpeningLikeElement) {
	const tabIndexProperty = node.attributes.properties.find(
		(property): property is ts.JsxAttribute =>
			ts.isJsxAttribute(property) &&
			ts.isIdentifier(property.name) &&
			property.name.text.toLowerCase() === "tabindex",
	);

	if (!tabIndexProperty?.initializer) {
		return undefined;
	}

	if (ts.isJsxExpression(tabIndexProperty.initializer)) {
		const expression = tabIndexProperty.initializer.expression;
		if (expression && ts.isNumericLiteral(expression)) {
			return Number(expression.text);
		}
	}

	if (ts.isStringLiteral(tabIndexProperty.initializer)) {
		return Number(tabIndexProperty.initializer.text);
	}

	return undefined;
}

function isAriaHiddenTrue(ariaHiddenProperty: ts.JsxAttribute) {
	if (!ariaHiddenProperty.initializer) {
		return false;
	}

	if (ts.isStringLiteral(ariaHiddenProperty.initializer)) {
		return ariaHiddenProperty.initializer.text === "true";
	}

	if (ts.isJsxExpression(ariaHiddenProperty.initializer)) {
		const expression = ariaHiddenProperty.initializer.expression;
		if (expression && expression.kind === ts.SyntaxKind.TrueKeyword) {
			return true;
		}
	}

	return false;
}
