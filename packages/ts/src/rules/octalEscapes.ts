import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using octal escape sequences in string literals.",
		id: "octalEscapes",
		preset: "logical",
	},
	messages: {
		noOctalEscape: {
			primary:
				"Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.",
			secondary: [
				"Octal escape sequences (e.g., `\\01`, `\\02`, `\\377`) are a deprecated feature in JavaScript that can lead to confusion and are forbidden in strict mode and template literals.",
				"They are less readable than their modern alternatives and can cause portability issues.",
			],
			suggestions: [
				"Use hexadecimal escape sequences (e.g., `\\x01`) or Unicode escape sequences (e.g., `\\u0001`) instead.",
			],
		},
	},
	setup(context) {
		function checkNode(
			node: ts.NoSubstitutionTemplateLiteral | ts.StringLiteral,
		) {
			// Remove quotes from the string literal
			const content = node.getText(context.sourceFile).slice(1, -1);

			// Match octal escapes: \0 followed by [0-7], or \1-7 optionally followed by [0-7]
			// But exclude escaped backslashes (\\)
			const match = /(?<!\\)\\0[0-7]|(?<!\\)\\[1-7][0-7]*/.exec(content);
			if (!match) {
				return undefined;
			}

			const nodeStart = node.getStart(context.sourceFile);

			context.report({
				message: "noOctalEscape",
				range: {
					begin: nodeStart + match.index + 1,
					end: nodeStart + match.index + match[0].length + 1,
				},
			});
		}

		return {
			visitors: {
				NoSubstitutionTemplateLiteral: checkNode,
				StringLiteral: checkNode,
			},
		};
	},
});
