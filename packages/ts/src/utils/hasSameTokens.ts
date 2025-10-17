import * as ts from "typescript";

export function hasSameTokens(
	nodeA: ts.Node,
	nodeB: ts.Node,
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

		const isToken =
			currentA.kind >= ts.SyntaxKind.FirstToken &&
			currentA.kind <= ts.SyntaxKind.LastToken;

		if (isToken) {
			if (currentA.getText(sourceFile) !== currentB.getText(sourceFile)) {
				return false;
			}
		} else {
			const childrenA = currentA.getChildren(sourceFile);
			const childrenB = currentB.getChildren(sourceFile);

			if (childrenA.length !== childrenB.length) {
				return false;
			}

			queueA.push(...childrenA);
			queueB.push(...childrenB);
		}
	}

	return queueA.length === queueB.length;
}
