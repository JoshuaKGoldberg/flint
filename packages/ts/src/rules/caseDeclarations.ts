import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports lexical declarations in case clauses without wrapping them in blocks.",
		id: "caseDeclarations",
		preset: "untyped",
	},
	messages: {
		unexpectedLexicalDeclaration: {
			primary:
				"Lexical declarations in case clauses should be wrapped in blocks.",
			secondary: [
				"Lexical declarations (let, const, function, class) are scoped to the entire switch statement, not just the case clause where they are declared.",
				"This can lead to unexpected behavior when the same variable name is used in multiple case clauses, as they will conflict in the same scope.",
			],
			suggestions: [
				"Wrap the case clause contents in curly braces {} to create a block scope.",
			],
		},
	},
	setup(context) {
		function hasLexicalDeclaration(
			statements: ts.NodeArray<ts.Statement>,
		): ts.Node | undefined {
			for (const statement of statements) {
				if (
					ts.isVariableStatement(statement) &&
					(statement.declarationList.flags & ts.NodeFlags.Let ||
						statement.declarationList.flags & ts.NodeFlags.Const)
				) {
					return statement.declarationList.getChildAt(0, context.sourceFile);
				}

				if (
					ts.isFunctionDeclaration(statement) ||
					ts.isClassDeclaration(statement)
				) {
					return statement.getChildAt(0, context.sourceFile);
				}
			}

			return undefined;
		}

		return {
			visitors: {
				CaseClause: (node) => {
					const declarationNode = hasLexicalDeclaration(node.statements);
					if (declarationNode) {
						context.report({
							message: "unexpectedLexicalDeclaration",
							range: getTSNodeRange(declarationNode, context.sourceFile),
						});
					}
				},
				DefaultClause: (node) => {
					const declarationNode = hasLexicalDeclaration(node.statements);
					if (declarationNode) {
						context.report({
							message: "unexpectedLexicalDeclaration",
							range: getTSNodeRange(declarationNode, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
