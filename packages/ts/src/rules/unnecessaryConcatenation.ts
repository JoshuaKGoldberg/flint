import { runtimeBase } from "@flint.fyi/core";
import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports string concatenation using the + operator when both operands are string literals.",
		id: "unnecessaryConcatenation",
		preset: "stylistic",
	},
	messages: {
		unnecessaryConcatenation: {
			primary:
				"This string concatenation can be streamlined into a single string literal.",
			secondary: [
				"Concatenating string literals with the + operator is unnecessary and reduces code readability.",
				"String literals can be combined into a single literal, which is clearer and potentially more performant.",
			],
			suggestions: [
				"Combine the string literals into a single string literal.",
			],
		},
	},
	setup() {
		return {
			...runtimeBase,
			visitors: {
				BinaryExpression: (node, context) => {
					if (
						node.operatorToken.kind === ts.SyntaxKind.PlusToken &&
						ts.isStringLiteral(node.left) &&
						ts.isStringLiteral(node.right)
					) {
						context.report({
							message: "unnecessaryConcatenation",
							range: getTSNodeRange(node.operatorToken, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
