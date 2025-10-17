import * as ts from "typescript";

/**
 * Determines whether two nodes are composed of the same tokens.
 * This comparison ignores comments and whitespace.
 */
export function hasSameTokens(
	nodeA: ts.Node,
	nodeB: ts.Node,
	sourceFile: ts.SourceFile,
): boolean {
	const tokensA: ts.Node[] = [];
	const tokensB: ts.Node[] = [];

	function collectTokens(node: ts.Node, tokens: ts.Node[]) {
		if (
			node.kind >= ts.SyntaxKind.FirstToken &&
			node.kind <= ts.SyntaxKind.LastToken
		) {
			tokens.push(node);
		}
		ts.forEachChild(node, (child) => {
			collectTokens(child, tokens);
		});
	}

	collectTokens(nodeA, tokensA);
	collectTokens(nodeB, tokensB);

	return (
		tokensA.length === tokensB.length &&
		tokensA.every(
			(token, index) =>
				token.kind === tokensB[index].kind &&
				token.getText(sourceFile) === tokensB[index].getText(sourceFile),
		)
	);
}
