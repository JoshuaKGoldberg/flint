import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports reassigning exception parameters in catch clauses.",
		id: "exceptionAssignments",
		preset: "logical",
	},
	messages: {
		noExAssign: {
			primary:
				"Exception parameters in catch clauses should not be reassigned.",
			secondary: [
				"Reassigning an exception parameter can make debugging more difficult by obscuring the original error.",
				"The exception parameter contains important information about what went wrong, and reassigning it can make it harder to understand the root cause of an error.",
			],
			suggestions: [
				"Use a different variable name for the new value instead of reassigning the exception parameter.",
			],
		},
	},
	setup(context) {
		const exceptionParameters = new Set<ts.Identifier>();

		return {
			visitors: {
				CatchClause: (node) => {
					if (node.variableDeclaration?.name.kind === ts.SyntaxKind.Identifier) {
						exceptionParameters.add(node.variableDeclaration.name);
					}
				},
				BinaryExpression: (node) => {
					if (
						ts.isAssignmentOperator(node.operatorToken.kind) &&
						node.left.kind === ts.SyntaxKind.Identifier &&
						exceptionParameters.has(node.left as ts.Identifier)
					) {
						context.report({
							message: "noExAssign",
							range: {
								begin: node.left.getStart(context.sourceFile),
								end: node.left.getEnd(),
							},
						});
					}
				},
				PostfixUnaryExpression: (node) => {
					if (
						(node.operator === ts.SyntaxKind.PlusPlusToken ||
							node.operator === ts.SyntaxKind.MinusMinusToken) &&
						node.operand.kind === ts.SyntaxKind.Identifier &&
						exceptionParameters.has(node.operand as ts.Identifier)
					) {
						context.report({
							message: "noExAssign",
							range: {
								begin: node.operand.getStart(context.sourceFile),
								end: node.operand.getEnd(),
							},
						});
					}
				},
				PrefixUnaryExpression: (node) => {
					if (
						(node.operator === ts.SyntaxKind.PlusPlusToken ||
							node.operator === ts.SyntaxKind.MinusMinusToken) &&
						node.operand.kind === ts.SyntaxKind.Identifier &&
						exceptionParameters.has(node.operand as ts.Identifier)
					) {
						context.report({
							message: "noExAssign",
							range: {
								begin: node.operand.getStart(context.sourceFile),
								end: node.operand.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
