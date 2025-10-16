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

function getStringValue(node: ts.Expression): string | undefined {
	if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
		return node.text;
	}
	return undefined;
}

function getTypeofOperand(node: ts.Expression): ts.Expression | undefined {
	if (ts.isTypeOfExpression(node)) {
		return node.expression;
	}
	return undefined;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports typeof expressions compared to invalid string literals.",
		id: "typeofComparisons",
		preset: "untyped",
	},
	messages: {
		invalidValue: {
			primary:
				'Invalid typeof comparison value. Expected one of: "bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined".',
			secondary: [
				"The typeof operator returns one of a specific set of string values.",
				"Comparing typeof to an invalid string is usually a typo and will never match.",
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
			}

			if (!comparisonValue) {
				return;
			}

			const stringValue = getStringValue(comparisonValue);
			if (stringValue && !validTypeofValues.has(stringValue)) {
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
