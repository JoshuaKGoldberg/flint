import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports inconsistent types when spreading a ternary in an array literal.",
		id: "arrayTernarySpreadingConsistency",
		preset: "stylistic",
	},
	messages: {
		inconsistentTypes: {
			primary:
				"Use consistent types in both branches when spreading a ternary in an array.",
			secondary: [
				"Mixing array and string types in ternary spread branches reduces code clarity.",
				"Both branches should use the same type: either arrays or strings.",
			],
			suggestions: ["Replace the empty string with an empty array."],
		},
	},
	setup(context) {
		return {
			visitors: {
				ArrayLiteralExpression: (node, { sourceFile }) => {
					for (const element of node.elements) {
						if (!ts.isSpreadElement(element)) {
							continue;
						}

						if (!ts.isParenthesizedExpression(element.expression)) {
							continue;
						}

						const inner = element.expression.expression;
						if (!ts.isConditionalExpression(inner)) {
							continue;
						}

						const whenTrue = unwrapParentheses(inner.whenTrue);
						const whenFalse = unwrapParentheses(inner.whenFalse);

						const trueIsArray = ts.isArrayLiteralExpression(whenTrue);
						const falseIsArray = ts.isArrayLiteralExpression(whenFalse);
						const trueIsString = isStringLike(whenTrue);
						const falseIsString = isStringLike(whenFalse);

						if (trueIsArray && falseIsString && isEmptyStringLike(whenFalse)) {
							context.report({
								fix: {
									range: {
										begin: whenFalse.getStart(sourceFile),
										end: whenFalse.getEnd(),
									},
									text: "[]",
								},
								message: "inconsistentTypes",
								range: {
									begin: whenFalse.getStart(sourceFile),
									end: whenFalse.getEnd(),
								},
							});
							continue;
						}

						if (trueIsString && falseIsArray && isEmptyArray(whenFalse)) {
							context.report({
								fix: {
									range: {
										begin: whenFalse.getStart(sourceFile),
										end: whenFalse.getEnd(),
									},
									text: "''",
								},
								message: "inconsistentTypes",
								range: {
									begin: whenFalse.getStart(sourceFile),
									end: whenFalse.getEnd(),
								},
							});
						}
					}
				},
			},
		};
	},
});

function isEmptyArray(node: ts.Expression) {
	return ts.isArrayLiteralExpression(node) && node.elements.length === 0;
}

function isEmptyStringLike(node: ts.Expression) {
	if (ts.isStringLiteral(node)) {
		return node.text === "";
	}

	if (ts.isNoSubstitutionTemplateLiteral(node)) {
		return node.text === "";
	}

	return false;
}

function isStringLike(node: ts.Expression) {
	return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);
}

function unwrapParentheses(node: ts.Expression): ts.Expression {
	if (ts.isParenthesizedExpression(node)) {
		return unwrapParentheses(node.expression);
	}

	return node;
}
