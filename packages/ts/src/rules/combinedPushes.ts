import ts from "typescript";

import type { Checker } from "../index.ts";
import { typescriptLanguage } from "../language.ts";
import type * as AST from "../types/ast.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports consecutive array.push() calls that could be combined into a single call.",
		id: "combinedPushes",
		preset: "stylistic",
		strictness: "strict",
	},
	messages: {
		combinePushes: {
			primary:
				"Consecutive `.push()` calls can be combined into a single call.",
			secondary: [
				"Multiple consecutive `.push()` calls on the same array can be combined.",
				"Use `.push(a, b, c)` instead of separate `.push(a)`, `.push(b)`, `.push(c)` calls.",
			],
			suggestions: ["Combine consecutive `.push()` calls into one."],
		},
	},
	setup(context) {
		function isArrayPushCall(
			node: AST.CallExpression,
			typeChecker: Checker,
		): boolean {
			if (!ts.isPropertyAccessExpression(node.expression)) {
				return false;
			}

			if (node.expression.name.text !== "push") {
				return false;
			}

			const arrayType = typeChecker.getTypeAtLocation(
				node.expression.expression,
			);

			return typeChecker.isArrayType(arrayType);
		}

		function getArrayName(
			node: AST.CallExpression,
			sourceFile: ts.SourceFile,
		): string | undefined {
			if (!ts.isPropertyAccessExpression(node.expression)) {
				return undefined;
			}
			return node.expression.expression.getText(sourceFile);
		}

		function isPushCallStatement(
			statement: AST.Statement,
			sourceFile: ts.SourceFile,
			typeChecker: Checker,
		): undefined | { arrayName: string; callExpression: AST.CallExpression } {
			if (!ts.isExpressionStatement(statement)) {
				return undefined;
			}

			const expr = statement.expression;
			if (!ts.isCallExpression(expr)) {
				return undefined;
			}

			if (!isArrayPushCall(expr, typeChecker)) {
				return undefined;
			}

			const arrayName = getArrayName(expr, sourceFile);
			if (!arrayName) {
				return undefined;
			}

			return { arrayName, callExpression: expr };
		}

		function checkStatements(
			statements: readonly AST.Statement[],
			sourceFile: ts.SourceFile,
			typeChecker: Checker,
		) {
			for (let i = 0; i < statements.length - 1; i++) {
				const currentStatement = statements[i];
				const currentPush = isPushCallStatement(
					currentStatement,
					sourceFile,
					typeChecker,
				);
				if (!currentPush) {
					continue;
				}

				const nextStatement = statements[i + 1];
				const nextPush = isPushCallStatement(
					nextStatement,
					sourceFile,
					typeChecker,
				);

				if (nextPush && nextPush.arrayName === currentPush.arrayName) {
					context.report({
						message: "combinePushes",
						range: {
							begin: currentStatement.getStart(sourceFile),
							end: nextStatement.getEnd(),
						},
					});
				}
			}
		}

		return {
			visitors: {
				Block: (node, { sourceFile, typeChecker }) => {
					checkStatements([...node.statements], sourceFile, typeChecker);
				},
				SourceFile: (node, { typeChecker }) => {
					checkStatements([...node.statements], node, typeChecker);
				},
			},
		};
	},
});
