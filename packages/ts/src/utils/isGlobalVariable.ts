import * as ts from "typescript";

/**
 * Checks if a node is a reference to a global variable (e.g., Object, undefined, NaN).
 * Global variables are those declared in TypeScript's lib files or are global identifiers
 * like undefined which have symbols but no user-defined declarations.
 */
export function isGlobalVariable(
	node: ts.Expression,
	typeChecker: ts.TypeChecker,
): boolean {
	if (node.kind !== ts.SyntaxKind.Identifier) {
		return false;
	}

	const symbol = typeChecker.getSymbolAtLocation(node);
	if (!symbol) {
		return false;
	}

	// Check if this identifier has the SymbolFlags.BlockScopedVariable
	// which would indicate it's a local variable shadowing a global
	const parent = node.parent;
	if (
		ts.isVariableDeclaration(parent) ||
		ts.isParameter(parent) ||
		ts.isFunctionDeclaration(parent)
	) {
		return false;
	}

	const declarations = symbol.getDeclarations();

	// undefined, NaN, Infinity etc. may have no declarations in some contexts
	// but are still global identifiers. Check if they're global scope symbols.
	if (!declarations || declarations.length === 0) {
		// If there are no declarations, it's likely a built-in global like undefined
		return true;
	}

	return declarations.some((declaration) => {
		const sourceFile = declaration.getSourceFile();
		return (
			sourceFile.hasNoDefaultLib ||
			/\/lib\.[^/]*\.d\.ts$/.test(sourceFile.fileName)
		);
	});
}
