import * as ts from "typescript";

import { declarationIncludesGlobal } from "./declarationIncludesGlobal.js";

/**
 * TODO: Use a scope analyzer (#400).
 */
export function isGlobalDeclarationOfName(
	node: ts.Expression,
	name: string,
	typeChecker: ts.TypeChecker,
): boolean {
	const declarations = typeChecker.getSymbolAtLocation(node)?.getDeclarations();
	if (!declarations) {
		return false;
	}

	return declarations.every((declaration) => {
		// Special case: a variable set to a known identifier. E.g.:
		// const CustomFunction = Function;
		if (
			ts.isVariableDeclaration(declaration) &&
			declaration.initializer &&
			declaration.initializer.kind === ts.SyntaxKind.Identifier
		) {
			return isGlobalDeclarationOfName(
				declaration.initializer,
				name,
				typeChecker,
			);
		}

		return (
			isDeclarationOfName(declaration, name) &&
			declarationIncludesGlobal(declaration)
		);
	});
}

function isDeclarationOfName(node: ts.Node, name: string) {
	if (
		ts.isClassDeclaration(node) ||
		ts.isFunctionDeclaration(node) ||
		ts.isInterfaceDeclaration(node) ||
		ts.isVariableDeclaration(node)
	) {
		return node.name && ts.isIdentifier(node.name) && node.name.text === name;
	}

	return false;
}
