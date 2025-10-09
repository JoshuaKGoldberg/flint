import * as ts from "typescript";

/**
 * Checks if two identifier nodes refer to the same variable using TypeScript's type checker.
 * This properly handles variable shadowing and scoping.
 *
 * TODO: Replace with a proper scope manager when available (see #400).
 */
export function isSameVariable(
	original: ts.Node,
	reference: ts.Node,
	typeChecker: ts.TypeChecker,
): boolean {
	const originalSymbol = typeChecker.getSymbolAtLocation(original);
	if (!originalSymbol) {
		return false;
	}

	const referencingSymbol = typeChecker.getSymbolAtLocation(reference);
	if (!referencingSymbol?.valueDeclaration) {
		return false;
	}

	return originalSymbol.valueDeclaration === referencingSymbol.valueDeclaration;
}
