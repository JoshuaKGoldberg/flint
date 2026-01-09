import ts from "typescript";

import { typescriptLanguage } from "../language.ts";
import { isBuiltinArrayMethod } from "../utils/isBuiltinArrayMethod.ts";

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
		const reportedStatements = new WeakSet<ts.Statement>();

		function getArrayName(
			node: ts.CallExpression,
			sourceFile: ts.SourceFile,
		): string | undefined {
			if (!ts.isPropertyAccessExpression(node.expression)) {
				return undefined;
			}
			return node.expression.expression.getText(sourceFile);
		}

		function isPushCallStatement(
			statement: ts.Statement,
			sourceFile: ts.SourceFile,
			typeChecker: ts.TypeChecker,
		): undefined | { arrayName: string; callExpression: ts.CallExpression } {
			if (!ts.isExpressionStatement(statement)) {
				return undefined;
			}

			const expr = statement.expression;
			if (!ts.isCallExpression(expr)) {
				return undefined;
			}

			if (!isBuiltinArrayMethod("push", expr, typeChecker)) {
				return undefined;
			}

			const arrayName = getArrayName(expr, sourceFile);
			if (!arrayName) {
				return undefined;
			}

			return { arrayName, callExpression: expr };
		}

		return {
			visitors: {
				Block: (node, { sourceFile, typeChecker }) => {
					checkStatements(node.statements, sourceFile, typeChecker);
				},
				SourceFile: (node, { typeChecker }) => {
					checkStatements(node.statements, node, typeChecker);
				},
			},
		};

		function checkStatements(
			statements: ts.NodeArray<ts.Statement>,
			sourceFile: ts.SourceFile,
			typeChecker: ts.TypeChecker,
		) {
			for (let i = 0; i < statements.length - 1; i++) {
				const currentStatement = statements[i];
				if (reportedStatements.has(currentStatement)) {
					continue;
				}

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
					reportedStatements.add(currentStatement);
					reportedStatements.add(nextStatement);

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
	},
});
