import * as ts from "typescript";

export function isDeclaredInNodeTypes(
	node: ts.Expression,
	typeChecker: ts.TypeChecker,
) {
	const declarations = typeChecker
		.getTypeAtLocation(node)
		.getSymbol()
		?.getDeclarations();

	return declarations?.some((declaration) =>
		declaration.getSourceFile().fileName.includes("node_modules/@types/node/"),
	);
}
