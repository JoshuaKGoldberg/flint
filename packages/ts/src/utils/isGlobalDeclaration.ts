import type * as ts from "typescript";

import { getDeclarationsIfGlobal } from "./getDeclarationsIfGlobal.ts";

export function isGlobalDeclaration(
	node: ts.Expression,
	typeChecker: ts.TypeChecker,
) {
	return !!getDeclarationsIfGlobal(node, typeChecker);
}
