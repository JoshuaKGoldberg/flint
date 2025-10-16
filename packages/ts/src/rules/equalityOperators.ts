import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports use of == and != operators instead of === and !== for type-safe equality checks.",
		id: "equalityOperators",
		preset: "stylistic",
	},
	messages: {
		unexpectedEquality: {
			primary: "Use {{ expected }} instead of {{ actual }}.",
			secondary: [
				"The == and != operators perform type coercion, which can lead to unexpected behavior.",
				"The === and !== operators are type-safe and should be used instead.",
				"Type coercion follows the Abstract Equality Comparison Algorithm, which has many edge cases.",
			],
			suggestions: [
				"Use === for equality checks.",
				"Use !== for inequality checks.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				BinaryExpression: (node) => {
					let actual: string | undefined;
					let expected: string | undefined;

					if (node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsToken) {
						actual = "==";
						expected = "===";
					} else if (
						node.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsToken
					) {
						actual = "!=";
						expected = "!==";
					}

					if (actual && expected) {
						context.report({
							data: {
								actual,
								expected,
							},
							message: "unexpectedEquality",
							range: getTSNodeRange(node.operatorToken, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
