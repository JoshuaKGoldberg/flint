import * as ts from "typescript";

export function isGlobalDeclaration(
	node: ts.Expression,
	typeChecker: ts.TypeChecker,
): boolean {
	const symbol = typeChecker.getSymbolAtLocation(node);
	if (!symbol) {
		return false;
	}

	const declarations = symbol.getDeclarations();

	return !!declarations?.some((declaration) => {
		const sourceFile = declaration.getSourceFile();
		return (
			sourceFile.hasNoDefaultLib ||
			/\/lib\.[^/]*\.d\.ts$/.test(sourceFile.fileName)
		);
	});
}
