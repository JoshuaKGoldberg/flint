import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

const errorConstructors = new Set([
	"AggregateError",
	"Error",
	"EvalError",
	"RangeError",
	"ReferenceError",
	"SyntaxError",
	"TypeError",
	"URIError",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports throwing new errors in catch blocks without preserving the original error as the cause.",
		id: "caughtErrorCauses",
		preset: "logical",
		strictness: "strict",
	},
	messages: {
		missingCause: {
			primary:
				"Preserve the original error by passing it as the `cause` option when throwing a new error.",
			secondary: [
				"When re-throwing errors, the original error contains valuable debugging information.",
				"Using the `cause` option maintains the complete error chain, improving traceability.",
				"Without preserving the cause, the original stack trace and error details are lost.",
			],
			suggestions: [
				"Add `{ cause: <caughtError> }` as the second argument to the error constructor.",
			],
		},
	},
	setup(context) {
		function getCatchParameter(node: ts.Node): ts.Identifier | undefined {
			const catchClause = ts.findAncestor(node, ts.isCatchClause);
			if (!catchClause) {
				return undefined;
			}

			const variable = catchClause.variableDeclaration;
			if (variable && ts.isIdentifier(variable.name)) {
				return variable.name;
			}

			return undefined;
		}

		function hasErrorCause(
			node: ts.NewExpression,
			catchParamName: string,
		): boolean {
			if (!node.arguments || node.arguments.length < 2) {
				return false;
			}

			const optionsArg = node.arguments[1];
			if (!ts.isObjectLiteralExpression(optionsArg)) {
				return false;
			}

			for (const property of optionsArg.properties) {
				if (!ts.isPropertyAssignment(property)) {
					continue;
				}

				if (!ts.isIdentifier(property.name) || property.name.text !== "cause") {
					continue;
				}

				if (
					ts.isIdentifier(property.initializer) &&
					property.initializer.text === catchParamName
				) {
					return true;
				}

				return true;
			}

			return false;
		}

		return {
			visitors: {
				ThrowStatement: (node, { sourceFile }) => {
					if (!ts.isNewExpression(node.expression)) {
						return;
					}

					const newExpr = node.expression;
					if (!ts.isIdentifier(newExpr.expression)) {
						return;
					}

					const errorName = newExpr.expression.text;
					if (!errorConstructors.has(errorName)) {
						return;
					}

					const catchParam = getCatchParameter(node);
					if (!catchParam) {
						return;
					}

					if (hasErrorCause(newExpr, catchParam.text)) {
						return;
					}

					context.report({
						message: "missingCause",
						range: {
							begin: newExpr.getStart(sourceFile),
							end: newExpr.getEnd(),
						},
					});
				},
			},
		};
	},
});
