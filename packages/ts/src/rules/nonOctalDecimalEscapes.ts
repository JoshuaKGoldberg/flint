import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

const nonOctalDecimalEscapePattern = /\\[89]/g;

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports non-octal decimal escape sequences (\\8 and \\9) in string literals.",
		id: "nonOctalDecimalEscapes",
		preset: "logical",
	},
	messages: {
		unexpectedEscape: {
			primary:
				"Non-octal decimal escape sequences (\\8 and \\9) should not be used in string literals.",
			secondary: [
				"Non-octal decimal escape sequences \\8 and \\9 are legacy features that are treated as identity escapes (the same as the literal digits).",
				"They are optional in the ECMAScript specification and not supported in strict mode in all environments.",
				"Use the literal digits directly instead.",
			],
			suggestions: [
				"Remove the backslash to use the literal digit.",
				"If an escape sequence is needed, use a Unicode escape like \\u0038 or \\u0039.",
			],
		},
	},
	setup(context) {
		function checkNode(
			node: ts.NoSubstitutionTemplateLiteral | ts.StringLiteral,
		) {
			const text = node.getText(context.sourceFile);
			const matches = [...text.matchAll(nonOctalDecimalEscapePattern)];

			for (const match of matches) {
				const start = node.getStart(context.sourceFile) + match.index;
				const end = start + match[0].length;

				context.report({
					message: "unexpectedEscape",
					range: {
						begin: start,
						end,
					},
				});
			}
		}

		return {
			visitors: {
				NoSubstitutionTemplateLiteral: checkNode,
				StringLiteral: checkNode,
			},
		};
	},
});
