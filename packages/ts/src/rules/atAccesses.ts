import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer using .at() for accessing elements at negative indices.",
		id: "atAccesses",
		preset: "stylistic",
	},
	messages: {
		preferAt: {
			primary:
				"Prefer using .at() with a negative index instead of calculating length minus an offset.",
			secondary: [
				"The .at() method provides a cleaner way to access elements from the end of an array or string.",
				"Using .at(-1) is more readable than array[array.length - 1].",
			],
			suggestions: [
				"Use .at() with a negative index to access elements from the end.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				ElementAccessExpression: (node, { sourceFile }) => {
					if (!isLengthMinusAccess(node, sourceFile)) {
						return;
					}

					context.report({
						message: "preferAt",
						range: getTSNodeRange(node, sourceFile),
					});
				},
			},
		};
	},
});

function hasSameText(
	a: ts.Expression,
	b: ts.Expression,
	sourceFile: ts.SourceFile,
) {
	return a.getText(sourceFile) === b.getText(sourceFile);
}

function isLengthMinusAccess(
	node: ts.ElementAccessExpression,
	sourceFile: ts.SourceFile,
) {
	const argument = node.argumentExpression;

	if (!ts.isBinaryExpression(argument)) {
		return false;
	}

	if (argument.operatorToken.kind !== ts.SyntaxKind.MinusToken) {
		return false;
	}

	const left = argument.left;
	if (!ts.isPropertyAccessExpression(left)) {
		return false;
	}

	if (left.name.text !== "length") {
		return false;
	}

	if (!hasSameText(left.expression, node.expression, sourceFile)) {
		return false;
	}

	const right = argument.right;
	if (!ts.isNumericLiteral(right)) {
		return false;
	}

	const offset = Number(right.text);
	if (!Number.isInteger(offset) || offset <= 0) {
		return false;
	}

	return true;
}
