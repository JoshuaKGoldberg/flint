import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

function isLocalExportsVariable(
	node: ts.Identifier,
	sourceFile: ts.SourceFile,
	typeChecker: ts.TypeChecker,
): boolean {
	// Check if this identifier has a symbol with local declarations
	const symbol = typeChecker.getSymbolAtLocation(node);
	if (!symbol) {
		// No symbol means it's likely a global variable or undefined
		// In either case, we want to report it
		return false;
	}

	const declarations = symbol.getDeclarations();
	if (!declarations || declarations.length === 0) {
		// No declarations means it's likely a global variable
		return false;
	}

	// Check if any declaration is a local parameter or variable (in the current file)
	return declarations.some((declaration) => {
		// Only consider declarations in the current source file as "local"
		if (declaration.getSourceFile() !== sourceFile) {
			return false;
		}

		return ts.isParameter(declaration) || ts.isVariableDeclaration(declaration);
	});
}

function isModuleExportsAccess(node: ts.Expression): boolean {
	if (!ts.isPropertyAccessExpression(node)) {
		return false;
	}

	return (
		ts.isIdentifier(node.expression) &&
		node.expression.text === "module" &&
		ts.isIdentifier(node.name) &&
		node.name.text === "exports"
	);
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prevent assignment to the `exports` variable in CommonJS modules.",
		id: "exportsAssignments",
		preset: "logical",
	},
	messages: {
		noExportsAssign: {
			primary:
				"Unexpected assignment to `exports`. Use `module.exports` instead.",
			secondary: [
				"Assigning to `exports` directly breaks the reference to `module.exports`.",
				"Use `module.exports` to ensure your exports work as expected.",
			],
			suggestions: ["Use `module.exports` instead of `exports`"],
		},
	},
	setup(context) {
		return {
			visitors: {
				BinaryExpression: (node) => {
					if (node.operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
						return;
					}

					if (!ts.isIdentifier(node.left) || node.left.text !== "exports") {
						return;
					}

					// Skip if exports is a local variable (function parameter or local var)
					if (
						isLocalExportsVariable(
							node.left,
							context.sourceFile,
							context.typeChecker,
						)
					) {
						return;
					}

					// Allow: module.exports = exports = {}
					if (
						ts.isBinaryExpression(node.right) &&
						node.right.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
						isModuleExportsAccess(node.right.left)
					) {
						return;
					}

					// Check parent: module.exports = exports = {}
					const parent = node.parent;
					if (
						ts.isBinaryExpression(parent) &&
						parent.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
						isModuleExportsAccess(parent.left)
					) {
						return;
					}

					context.report({
						message: "noExportsAssign",
						range: getTSNodeRange(node.left, context.sourceFile),
					});
				},
			},
		};
	},
});
