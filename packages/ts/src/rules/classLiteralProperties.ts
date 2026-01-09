import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

function checkGetAccessor(
	node: ts.GetAccessorDeclaration,
	sourceFile: ts.SourceFile,
	report: (range: { begin: number; end: number }) => void,
) {
	if (node.body?.statements.length !== 1) {
		return;
	}

	const statement = node.body.statements[0];
	if (!ts.isReturnStatement(statement) || !statement.expression) {
		return;
	}

	if (!isLiteralValue(statement.expression)) {
		return;
	}

	report({
		begin: node.getStart(sourceFile),
		end: node.getEnd(),
	});
}

function isLiteralValue(node: ts.Expression): boolean {
	switch (node.kind) {
		case ts.SyntaxKind.FalseKeyword:
		case ts.SyntaxKind.NullKeyword:
		case ts.SyntaxKind.TrueKeyword:
			return true;
	}

	return (
		ts.isBigIntLiteral(node) ||
		ts.isNoSubstitutionTemplateLiteral(node) ||
		ts.isNumericLiteral(node) ||
		ts.isRegularExpressionLiteral(node) ||
		ts.isStringLiteral(node)
	);
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Enforce that literals on classes are exposed in a consistent style.",
		id: "classLiteralProperties",
		preset: "stylistic",
	},
	messages: {
		preferField: {
			primary:
				"Prefer declaring this literal value as a readonly field instead of a getter.",
			secondary: [
				"Readonly fields are more concise and avoid the overhead of a getter function.",
				"For literal values that never change, a readonly field clearly communicates the intent.",
			],
			suggestions: [
				"Convert this getter to a readonly field with the same value.",
			],
		},
	},
	setup(context) {
		function visitClass(
			node: ts.ClassDeclaration | ts.ClassExpression,
			sourceFile: ts.SourceFile,
		) {
			for (const member of node.members) {
				if (ts.isGetAccessorDeclaration(member)) {
					checkGetAccessor(member, sourceFile, (range) => {
						context.report({
							message: "preferField",
							range,
						});
					});
				}
			}
		}

		return {
			visitors: {
				ClassDeclaration: (node, { sourceFile }) => {
					visitClass(node, sourceFile);
				},
				ClassExpression: (node, { sourceFile }) => {
					visitClass(node, sourceFile);
				},
			},
		};
	},
});
