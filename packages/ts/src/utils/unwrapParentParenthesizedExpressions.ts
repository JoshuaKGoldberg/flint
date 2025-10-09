import * as ts from "typescript";

export function unwrapParenthesizedExpressionsParent(node: ts.Node): ts.Node {
	return ts.isParenthesizedExpression(node.parent)
		? unwrapParenthesizedExpressionsParent(node.parent)
		: node.parent;
}
