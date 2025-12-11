import { type RuleContext, runtimeBase } from "@flint.fyi/core";
import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage, type TypeScriptServices } from "../language.js";

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
				"Variables declared in case clauses without braces leak into the surrounding scope.",
			secondary: [
				"Lexical declarations (let, const, function, class) are scoped to the entire switch statement, not just the case clause where they are declared.",
				"This can lead to unexpected behavior when the same variable name is used in multiple case clauses, as they will conflict in the same scope.",
			],
			suggestions: [
				"Wrap the case clause contents in curly braces {} to create a block scope.",
			],
		},
	},
	setup() {
		return {
			...runtimeBase,
			visitors: {
				CaseClause: checkClause,
				DefaultClause: checkClause,
			},
		};
	},
});

function checkClause(
	node: ts.CaseClause | ts.DefaultClause,
	context: RuleContext<"unexpectedLexicalDeclaration"> & TypeScriptServices,
): void {
	const declarationNode = getLexicalDeclaration(node.statements, context);
	if (declarationNode) {
		context.report({
			message: "unexpectedLexicalDeclaration",
			range: getTSNodeRange(declarationNode, context.sourceFile),
		});
	}
}

function getLexicalDeclaration(
	statements: ts.NodeArray<ts.Statement>,
	context: TypeScriptServices,
): ts.Node | undefined {
	for (const statement of statements) {
		if (
			ts.isVariableStatement(statement) &&
			tsutils.isNodeFlagSet(
				statement.declarationList,
				ts.NodeFlags.Let | ts.NodeFlags.Const,
			)
		) {
			return statement.declarationList.getChildAt(0, context.sourceFile);
		}

		if (
			ts.isClassDeclaration(statement) ||
			ts.isFunctionDeclaration(statement)
		) {
			return statement.getChildAt(0, context.sourceFile);
		}
	}

	return undefined;
}
