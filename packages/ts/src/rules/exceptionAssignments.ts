import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";
import { isSameVariable } from "../utils/isSameVariable.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports reassigning exception parameters in catch clauses.",
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
		const exceptionParameters: ts.Identifier[] = [];

		function isAssignmentOperator(kind: ts.SyntaxKind): boolean {
			return (
				kind === ts.SyntaxKind.EqualsToken ||
				kind === ts.SyntaxKind.PlusEqualsToken ||
				kind === ts.SyntaxKind.MinusEqualsToken ||
				kind === ts.SyntaxKind.AsteriskEqualsToken ||
				kind === ts.SyntaxKind.AsteriskAsteriskEqualsToken ||
				kind === ts.SyntaxKind.SlashEqualsToken ||
				kind === ts.SyntaxKind.PercentEqualsToken ||
				kind === ts.SyntaxKind.LessThanLessThanEqualsToken ||
				kind === ts.SyntaxKind.GreaterThanGreaterThanEqualsToken ||
				kind === ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken ||
				kind === ts.SyntaxKind.AmpersandEqualsToken ||
				kind === ts.SyntaxKind.BarEqualsToken ||
				kind === ts.SyntaxKind.CaretEqualsToken ||
				kind === ts.SyntaxKind.AmpersandAmpersandEqualsToken ||
				kind === ts.SyntaxKind.BarBarEqualsToken ||
				kind === ts.SyntaxKind.QuestionQuestionEqualsToken
			);
		}

		function isExceptionParameter(identifier: ts.Identifier): boolean {
			return exceptionParameters.some((param) =>
				isSameVariable(param, identifier, context.typeChecker),
			);
		}

		return {
			visitors: {
				BinaryExpression: (node) => {
					if (
						isAssignmentOperator(node.operatorToken.kind) &&
						node.left.kind === ts.SyntaxKind.Identifier &&
						isExceptionParameter(node.left as ts.Identifier)
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
				CatchClause: (node) => {
					if (
						node.variableDeclaration?.name.kind === ts.SyntaxKind.Identifier
					) {
						exceptionParameters.push(node.variableDeclaration.name);
					}
				},
				PostfixUnaryExpression: (node) => {
					if (
						node.operand.kind === ts.SyntaxKind.Identifier &&
						isExceptionParameter(node.operand as ts.Identifier)
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
						isExceptionParameter(node.operand as ts.Identifier)
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
