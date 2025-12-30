import * as ts from "typescript";

import { declarationsIncludeGlobal } from "./declarationsIncludeGlobal.js";

export function getDeclarationsIfGlobal(
	node: ts.Expression,
	typeChecker: ts.TypeChecker,
) {
	const declarations = typeChecker.getSymbolAtLocation(node)?.getDeclarations();

	return !!declarations && declarationsIncludeGlobal(declarations)
		? declarations
		: undefined;
}
