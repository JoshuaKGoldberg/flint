import * as ts from "typescript";

export function unwrapParentParenthesizedExpressions(node: ts.Node): ts.Node {
	let current = node.parent;
	while (ts.isParenthesizedExpression(current)) {
		current = current.parent;
	}
	return current;
}
