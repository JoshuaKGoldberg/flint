import ts from "typescript";

import type { AST } from "../index.ts";
import { hasSameTokens } from "./hasSameTokens.ts";
import { unwrapParenthesizedExpression } from "./unwrapParenthesizedExpression.ts";

export function isSameNode(
	nodeA: AST.Expression,
	nodeB: AST.Expression,
	sourceFile: ts.SourceFile,
): boolean {
	const unwrappedA = unwrapParenthesizedExpression(nodeA) as AST.Expression;
	const unwrappedB = unwrapParenthesizedExpression(nodeB) as AST.Expression;

	return hasSameTokens(unwrappedA, unwrappedB, sourceFile);
}
