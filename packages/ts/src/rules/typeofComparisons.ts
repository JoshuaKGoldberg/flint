import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

const validTypeofValues = new Set([
	"bigint",
	"boolean",
	"function",
	"number",
	"object",
	"string",
	"symbol",
	"undefined",
]);

// TODO: Reuse a shared getStaticValue-style utility?
function getStringValue(node: ts.Expression) {
	return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
		? node.text
		: undefined;
}

function getTypeofOperand(node: ts.Expression) {
	return ts.isTypeOfExpression(node) && node.expression;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports typeof expressions that compare impossible string literals.",
		id: "typeofComparisons",
		preset: "untyped",
	},
	messages: {
		invalidValue: {
			primary:
				"This string literal is not one that the typeof operator will ever produce.",
			secondary: [
				"The typeof operator returns one of a specific set of string values.",
				"Comparing typeof to an invalid string is usually a typo and will never match.",
				'The only valid values are: "bigint", "boolean", "function", "number", "object", "string", "symbol", and "undefined".',
			],
			suggestions: [
				"Check for typos and use one of the valid typeof return values.",
			],
		},
	},
	setup(context) {
		function checkComparison(node: ts.BinaryExpression) {
			const leftTypeofOperand = getTypeofOperand(node.left);
			const rightTypeofOperand = getTypeofOperand(node.right);

			let comparisonValue: ts.Expression | undefined;
			if (leftTypeofOperand) {
				comparisonValue = node.right;
			} else if (rightTypeofOperand) {
				comparisonValue = node.left;
			} else {
				return;
			}

			const stringValue = getStringValue(comparisonValue);
			if (stringValue != null && !validTypeofValues.has(stringValue)) {
				context.report({
					message: "invalidValue",
					range: getTSNodeRange(comparisonValue, context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				BinaryExpression: (node) => {
					if (
						node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsToken ||
						node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken ||
						node.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsToken ||
						node.operatorToken.kind ===
							ts.SyntaxKind.ExclamationEqualsEqualsToken
					) {
						checkComparison(node);
					}
				},
			},
		};
	},
});
