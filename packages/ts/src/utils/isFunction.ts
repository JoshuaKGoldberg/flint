import type * as ts from "typescript";

export function isFunction(node: ts.Expression, typeChecker: ts.TypeChecker) {
	const objectType = typeChecker.getTypeAtLocation(node);
	const callSignatures = objectType.getCallSignatures();

	return !!callSignatures.length;
}
