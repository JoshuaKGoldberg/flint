import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

/**
 * Checks if a string contains octal escape sequences.
 * Octal escapes are:
 * - \0 followed by an octal digit (0-7)
 * - \1 through \7 optionally followed by more octal digits
 * But \0 alone (null character) is allowed.
 *
 * We need to check the actual source text, not the interpreted string.
 */
function hasOctalEscape(text: string): boolean {
	// Remove quotes from the string literal
	const content = text.slice(1, -1);

	// Match octal escapes: \0 followed by [0-7], or \1-7 optionally followed by [0-7]
	// But exclude escaped backslashes (\\)
	const octalEscapePattern = /(?<!\\)\\0[0-7]|(?<!\\)\\[1-7][0-7]*/;
	return octalEscapePattern.test(content);
}

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using octal escape sequences in string literals.",
		id: "octalEscapes",
		preset: "logical",
	},
	messages: {
		noOctalEscape: {
			primary: "Octal escape sequences should not be used in string literals.",
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
		return {
			visitors: {
				StringLiteral: (node) => {
					const text = node.getText(context.sourceFile);

					if (hasOctalEscape(text)) {
						context.report({
							message: "noOctalEscape",
							range: {
								begin: node.getStart(context.sourceFile),
								end: node.getEnd(),
							},
						});
					}
				},
				NoSubstitutionTemplateLiteral: (node) => {
					const text = node.getText(context.sourceFile);

					if (hasOctalEscape(text)) {
						context.report({
							message: "noOctalEscape",
							range: {
								begin: node.getStart(context.sourceFile),
								end: node.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
