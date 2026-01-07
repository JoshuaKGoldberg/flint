import type * as ts from "typescript";

import { declarationsIncludeGlobal } from "./declarationsIncludeGlobal.ts";

export function getDeclarationsIfGlobal(
	node: ts.Expression,
	typeChecker: ts.TypeChecker,
) {
	const declarations = typeChecker.getSymbolAtLocation(node)?.getDeclarations();

	return !!declarations && declarationsIncludeGlobal(declarations)
		? declarations
		: undefined;
}
