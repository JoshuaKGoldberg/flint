import * as ts from "typescript";

export function unwrapParenthesizedExpression(
	expression: ts.Expression,
): ts.Expression {
	while (ts.isParenthesizedExpression(expression)) {
		expression = expression.expression;
	}
	return expression;
}
