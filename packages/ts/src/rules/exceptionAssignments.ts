import * as tsutils from "ts-api-utils";
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
		const exceptionParameters: ts.Node[] = [];

		function isExceptionParameter(node: ts.Node): boolean {
			return exceptionParameters.some((param) =>
				isSameVariable(param, node, context.typeChecker),
			);
		}

		function collectBindingElements(name: ts.BindingName): void {
			if (ts.isIdentifier(name)) {
				exceptionParameters.push(name);
			} else if (
				ts.isObjectBindingPattern(name) ||
				ts.isArrayBindingPattern(name)
			) {
				for (const element of name.elements) {
					if (ts.isBindingElement(element)) {
						collectBindingElements(element.name);
					}
				}
			}
		}

		return {
			visitors: {
				BinaryExpression: (node) => {
					if (
						tsutils.isAssignmentKind(node.operatorToken.kind) &&
						ts.isIdentifier(node.left) &&
						isExceptionParameter(node.left)
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
					if (node.variableDeclaration?.name) {
						collectBindingElements(node.variableDeclaration.name);
					}
				},
				PostfixUnaryExpression: (node) => {
					if (
						ts.isIdentifier(node.operand) &&
						isExceptionParameter(node.operand)
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
						ts.isIdentifier(node.operand) &&
						isExceptionParameter(node.operand)
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
