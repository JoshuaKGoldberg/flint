import * as ts from "typescript";

import { declarationsIncludeGlobal } from "./declarationsIncludeGlobal.js";

export function isGlobalDeclaration(
	node: ts.Expression,
	typeChecker: ts.TypeChecker,
): boolean {
	const declarations = typeChecker.getSymbolAtLocation(node)?.getDeclarations();

	return !!declarations && declarationsIncludeGlobal(declarations);
}
