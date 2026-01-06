import type ts from "typescript";

import type { Checker } from "../types/checker.ts";

export function isFunction(node: ts.Expression, typeChecker: Checker) {
	const objectType = typeChecker.getTypeAtLocation(node);
	const callSignatures = objectType.getCallSignatures();

	return !!callSignatures.length;
}
