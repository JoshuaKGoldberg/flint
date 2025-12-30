import * as ts from "typescript";

import { getDeclarationsIfGlobal } from "./getDeclarationsIfGlobal.js";

export function isGlobalDeclaration(
	node: ts.Expression,
	typeChecker: ts.TypeChecker,
) {
	return !!getDeclarationsIfGlobal(node, typeChecker);
}
