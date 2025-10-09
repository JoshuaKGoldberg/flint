import * as ts from "typescript";

/**
 * Checks if two identifier nodes refer to the same variable using TypeScript's type checker.
 * This properly handles variable shadowing and scoping.
 *
 * TODO: Replace with a proper scope manager when available (see #400).
 * @param identifier1 The first identifier to compare.
 * @param identifier2 The second identifier to compare.
 * @param typeChecker The TypeScript type checker.
 * @returns true if both identifiers refer to the same variable declaration.
 */
export function isSameVariable(
	identifier1: ts.Identifier,
	identifier2: ts.Identifier,
	typeChecker: ts.TypeChecker,
): boolean {
	const symbol1 = typeChecker.getSymbolAtLocation(identifier1);
	const symbol2 = typeChecker.getSymbolAtLocation(identifier2);

	if (!symbol1 || !symbol2) {
		return false;
	}

	// Get the value declaration for each symbol
	const declaration1 = symbol1.valueDeclaration;
	const declaration2 = symbol2.valueDeclaration;

	if (!declaration1 || !declaration2) {
		return false;
	}

	// Check if they refer to the same declaration
	return declaration1 === declaration2;
}
