import ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports getters that return literal values instead of using readonly class fields.",
		id: "classLiteralProperties",
		preset: "stylistic",
	},
	messages: {
		preferField: {
			primary:
				"Prefer a readonly class field over a getter returning a literal value.",
			secondary: [
				"Readonly fields are more concise and avoid the overhead of a function call.",
				"Getters returning literal values provide no benefit over readonly fields.",
			],
			suggestions: ["Replace this getter with a readonly field."],
		},
	},
	setup(context) {
		return {
			visitors: {
				GetAccessor: (node, { sourceFile }) => {
					if (!node.body) {
						return;
					}

					if (node.body.statements.length !== 1) {
						return;
					}

					const statement = node.body.statements[0];
					if (!statement || !ts.isReturnStatement(statement)) {
						return;
					}

					if (!statement.expression) {
						return;
					}

					if (!isLiteralValue(statement.expression)) {
						return;
					}

					context.report({
						message: "preferField",
						range: {
							begin: node.getStart(sourceFile),
							end: node.getEnd(),
						},
					});
				},
			},
		};
	},
});

function isLiteralValue(node: ts.Node): boolean {
	if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
		return true;
	}

	if (ts.isNumericLiteral(node) || ts.isBigIntLiteral(node)) {
		return true;
	}

	if (ts.isRegularExpressionLiteral(node)) {
		return true;
	}

	if (
		node.kind === ts.SyntaxKind.TrueKeyword ||
		node.kind === ts.SyntaxKind.FalseKeyword
	) {
		return true;
	}

	if (node.kind === ts.SyntaxKind.NullKeyword) {
		return true;
	}

	if (ts.isPrefixUnaryExpression(node)) {
		return isLiteralValue(node.operand);
	}

	return false;
}
