import { textLanguage } from "@flint.fyi/text";
import { parseJsonSafe } from "@flint.fyi/utils";
import type { DocumentValidator } from "cspell-lib";
import { suggestionsForWord } from "cspell-lib";

import { createDocumentValidator } from "./createDocumentValidator.ts";

interface CSpellConfigLike {
	words?: string[];
}

interface FileTask {
	documentValidatorTask: Promise<DocumentValidator | undefined>;
	text: string;
}

interface WordSuggestion {
	id: string;
	range: { begin: number; end: number };
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
			secondary: [
				'The word "{{ word }}" is not in the project\'s dictionary (cspell.json).',
				"If it's intentional, add it to cspell.json under `words`.",
			],
			suggestions: ['Add "{{ word }}" to dictionary if intentional.'],
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

					const finalizedSettings = documentValidator.getFinalizedDocSettings();

					for (const issue of issues) {
						const issueRange = {
							begin: issue.offset,
							end: issue.offset + (issue.length ?? issue.text.length),
						};

						const suggestionsResult = await suggestionsForWord(
							issue.text,
							finalizedSettings,
						);
						const wordSuggestions: WordSuggestion[] = [];
						for (const s of suggestionsResult.suggestions) {
							if (s.forbidden || s.noSuggest) {
								continue;
							}

							wordSuggestions.push({
								id: `replaceWith${s.word}`,
								range: issueRange,
								text: s.wordAdjustedToMatchCase ?? s.word,
							});

							if (wordSuggestions.length >= 5) {
								break;
							}
						}

						context.report({
							data: {
								word: issue.text,
							},
							message: "issue",
							range: issueRange,
							suggestions: [
								...wordSuggestions,
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
