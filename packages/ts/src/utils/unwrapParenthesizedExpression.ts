import * as ts from "typescript";

import * as AST from "../types/ast.ts";

export function unwrapParenthesizedExpression(
	expression: AST.ConciseBody | AST.Expression,
): AST.ConciseBody | AST.Expression {
	return ts.isParenthesizedExpression(expression)
		? unwrapParenthesizedExpression(expression.expression)
		: expression;
}
