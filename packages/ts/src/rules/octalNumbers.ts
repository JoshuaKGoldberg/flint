import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using legacy octal numeric literals.",
		id: "octalNumbers",
		preset: "logical",
	},
	messages: {
		noOctalNumber: {
			primary:
				"Use explicit octal syntax with the '0o' prefix instead of legacy octal numeric literals.",
			secondary: [
				"Legacy octal numeric literals (e.g., `077`, `0123`) are a deprecated feature in JavaScript that can lead to confusion and errors.",
				"They are forbidden in strict mode and are less readable than their modern alternatives.",
				"The digit `0` by itself is allowed as it represents zero, not an octal literal.",
			],
			suggestions: [
				"Use the explicit octal syntax (e.g., `0o77`) introduced in ES6, which is clearer and works in both strict and non-strict modes.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				NumericLiteral: (node) => {
					const text = node.getText(context.sourceFile);

					// Check for legacy octal literal: starts with 0 followed by octal digits (0-7)
					// But not just "0" alone, and not modern formats like 0x, 0o, 0b
					// cspell:ignore xobi
					if (
						text.length > 1 &&
						text.startsWith("0") &&
						text[1] >= "0" &&
						text[1] <= "7" &&
						!/^0[xobi]/i.test(text)
					) {
						context.report({
							message: "noOctalNumber",
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
