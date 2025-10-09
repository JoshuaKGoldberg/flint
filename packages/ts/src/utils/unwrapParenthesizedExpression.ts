import * as ts from "typescript";

export function unwrapParenthesizedExpression(
	expression: ts.Expression,
): ts.Expression {
	return ts.isParenthesizedExpression(expression)
		? unwrapParenthesizedExpression(expression.expression)
		: expression;
}
