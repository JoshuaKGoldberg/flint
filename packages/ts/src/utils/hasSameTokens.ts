import ts from "typescript";

import type { AST } from "../index.ts";

function getTokenText(node: ts.Node, sourceFile: ts.SourceFile): string {
	return sourceFile.text.slice(node.getStart(sourceFile), node.getEnd());
}

export function hasSameTokens(
	nodeA: AST.Expression,
	nodeB: AST.Expression,
	sourceFile: ts.SourceFile,
): boolean {
	const queueA: ts.Node[] = [nodeA];
	const queueB: ts.Node[] = [nodeB];

	while (true) {
		const currentA = queueA.shift();
		const currentB = queueB.shift();

		if (!currentA || !currentB) {
			break;
		}

		if (currentA.kind !== currentB.kind) {
			return false;
		}

		if (ts.isTokenKind(currentA.kind)) {
			if (
				getTokenText(currentA, sourceFile) !==
				getTokenText(currentB, sourceFile)
			) {
				return false;
			}
			continue;
		}

		const childrenA = currentA.getChildren(sourceFile);
		const childrenB = currentB.getChildren(sourceFile);

		if (childrenA.length !== childrenB.length) {
			return false;
		}

		queueA.push(...childrenA);
		queueB.push(...childrenB);
	}

	return queueA.length === queueB.length;
}
