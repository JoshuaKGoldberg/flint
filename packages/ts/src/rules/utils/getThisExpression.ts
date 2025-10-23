import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

export function getThisExpression(node: ts.Node): null | ts.ThisExpression {
	while (true) {
		node = skipParentheses(node);
		if (ts.isCallExpression(node) || tsutils.isAccessExpression(node)) {
			node = node.expression;
		} else if (tsutils.isThisExpression(node)) {
			return node;
		} else {
			break;
		}
	}

	return null;
}

function skipParentheses(node: ts.Node): ts.Node {
	while (ts.isParenthesizedExpression(node)) {
		node = node.expression;
	}
	return node;
}
