import type * as ts from "typescript";

export function getConstrainedTypeAtLocation(
	node: ts.Node,
	typeChecker: ts.TypeChecker,
) {
	const type = typeChecker.getTypeAtLocation(node);
	return typeChecker.getBaseConstraintOfType(type) ?? type;
}
