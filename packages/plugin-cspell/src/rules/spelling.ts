import { textLanguage } from "@flint.fyi/text";

import { createDocumentValidator } from "./createDocumentValidator.js";

interface CSpellConfigLike {
	words?: string[];
}

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
						suggestions: [
							{
								generators: {
									"cspell.json": (text) => {
										const original = JSON.parse(
											text,
										) as CSpellConfigLike | null;
										const words = original?.words ?? [];

										return words.includes(issue.text)
											? []
											: [
													{
														range: {
															begin: 0,
															end: 0,
														},
														text: JSON.stringify({
															...original,
															words: [...words, issue.text],
														}),
													},
												];
									},
								},
								id: "addWordToWords",
							},
						],
					});
				}
			},
		};
	},
});
