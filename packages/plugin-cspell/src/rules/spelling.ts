import { textLanguage } from "@flint.fyi/text";

import { getDocumentValidator } from "./getDocumentValidator.js";

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
		const documentValidator = await getDocumentValidator(
			context.filePathAbsolute,
			context.sourceText,
		);

		return {
			file(text) {
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
						message: "issue",
						range: {
							begin: issue.offset,
							end: issue.offset + (issue.length ?? issue.text.length),
						},
					});
				}
			},
		};
	},
});
