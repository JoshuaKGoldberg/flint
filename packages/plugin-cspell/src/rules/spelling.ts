import { textLanguage } from "@flint.fyi/text";

import { createDocumentValidator } from "./createDocumentValidator.js";

export default textLanguage.createRule({
	about: {
		id: "duplicateTestCases",
		preset: "logical",
	},
	messages: {
		issue: {
			primary: 'Forbidden or unknown word: "{{ word }}".',
			secondary: ["TODO"],
			suggestions: ["TODO"],
		},
	},
	async setup(context) {
		const documentValidator = await createDocumentValidator(
			context.filePathAbsolute,
			context.sourceText,
		);
		if (!documentValidator) {
			return undefined;
		}

		return {
			dependencies: ["cspell.json"],
			visitors: {
				file: (text) => {
					const issues = documentValidator.checkText(
						[0, text.length],
						undefined,
						undefined,
					);

					for (const issue of issues) {
						context.report({
							data: {
								word: issue.text,
							},
							// dependencies: ["cspell.json"],
							message: "issue",
							range: {
								begin: issue.offset,
								end: issue.offset + (issue.length ?? issue.text.length),
							},
						});
					}
				},
			},
		};
	},
});
