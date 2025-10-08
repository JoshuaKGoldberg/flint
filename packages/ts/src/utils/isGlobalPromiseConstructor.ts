import * as ts from "typescript";

export function isGlobalPromiseConstructor(
	node: ts.Expression,
	typeChecker: ts.TypeChecker,
): boolean {
	if (node.kind !== ts.SyntaxKind.Identifier) {
		return false;
	}

	const symbol = typeChecker.getSymbolAtLocation(node);
	if (!symbol) {
		return false;
	}

	const declarations = symbol.getDeclarations();
	if (!declarations || declarations.length === 0) {
		return false;
	}

	// Check if any declaration is in a lib.d.ts file
	return declarations.some((declaration) => {
		const sourceFile = declaration.getSourceFile();
		return (
			sourceFile.hasNoDefaultLib ||
			/\/lib\.[^/]*\.d\.ts$/.test(sourceFile.fileName)
		);
	});
}
