import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

function isLocalExportsVariable(
	node: ts.Identifier,
	sourceFile: ts.SourceFile,
	typeChecker: ts.TypeChecker,
) {
	return typeChecker
		.getSymbolAtLocation(node)
		?.getDeclarations()
		?.some((declaration) => declaration.getSourceFile() === sourceFile);
}

function isModuleExportsAccess(node: ts.Expression) {
	return (
		ts.isPropertyAccessExpression(node) &&
		ts.isIdentifier(node.expression) &&
		node.expression.text === "module" &&
		ts.isIdentifier(node.name) &&
		node.name.text === "exports"
	);
}

function isModuleExportsAccessAssignment(node: ts.Node) {
	return (
		ts.isBinaryExpression(node) &&
		node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
		isModuleExportsAccess(node.left)
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
				"Assigning to `exports` rather than `module.exports` may break references to `module.exports`.",
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
				BinaryExpression: (node, { sourceFile, typeChecker }) => {
					if (
						node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
						ts.isIdentifier(node.left) &&
						node.left.text === "exports" &&
						!isLocalExportsVariable(node.left, sourceFile, typeChecker) &&
						!isModuleExportsAccessAssignment(node.right) &&
						!isModuleExportsAccessAssignment(node.parent)
					) {
						context.report({
							message: "noExportsAssign",
							range: getTSNodeRange(node.left, sourceFile),
						});
					}
				},
			},
		};
	},
});
