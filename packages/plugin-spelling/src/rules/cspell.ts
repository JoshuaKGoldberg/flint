import { textLanguage } from "@flint.fyi/text";
import { parseJsonSafe } from "@flint.fyi/utils";
import { DocumentValidator } from "cspell-lib";

import { createDocumentValidator } from "./createDocumentValidator.js";

interface CSpellConfigLike {
	words?: string[];
}

interface FileTask {
	documentValidatorTask: Promise<DocumentValidator | undefined>;
	text: string;
}

export default textLanguage.createRule({
	about: {
		description: "Runs the CSpell spell checker on any source code file.",
		id: "cspell",
		preset: "logical",
	},
	messages: {
		issue: {
			primary: 'Forbidden or unknown word: "{{ word }}".',
			secondary: ["TODO"],
			suggestions: ["TODO"],
		},
	},
	setup(context) {
		const fileTasks: FileTask[] = [];

		return {
			dependencies: ["cspell.json"],
			teardown: async () => {
				for (const { documentValidatorTask, text } of fileTasks) {
					const documentValidator = await documentValidatorTask;
					if (!documentValidator) {
						return undefined;
					}

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
									files: {
										"cspell.json": (text) => {
											const original = parseJsonSafe(
												text,
											) as CSpellConfigLike | null;
											const words = original?.words ?? [];

											return words.includes(issue.text)
												? []
												: [
														{
															range: {
																begin: 0,
																end: text.length,
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
				}
			},
			visitors: {
				file: (text, { filePathAbsolute }) => {
					fileTasks.push({
						documentValidatorTask: createDocumentValidator(
							filePathAbsolute,
							text,
						),
						text,
					});
				},
			},
		};
	},
});
