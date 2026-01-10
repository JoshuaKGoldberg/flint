import { textLanguage } from "@flint.fyi/text";
import { parseJsonSafe } from "@flint.fyi/utils";
import type { DocumentValidator } from "cspell-lib";
import { suggestionsForWord } from "cspell-lib";

import { createDocumentValidator } from "./createDocumentValidator.ts";

/**
 * The maximum number of word suggestions to show in a report.
 */
const MAX_WORD_SUGGESTIONS = 5;

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
			suggestions: [
				'Add "{{ word }}" to dictionary.',
				"Replace with: {{ replacement0 }}",
				"Replace with: {{ replacement1 }}",
				"Replace with: {{ replacement2 }}",
				"Replace with: {{ replacement3 }}",
				"Replace with: {{ replacement4 }}",
			],
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
						const wordSuggestionTexts: string[] = [];
						for (const s of suggestionsResult.suggestions) {
							if (s.forbidden || s.noSuggest) {
								continue;
							}

							const suggestionWord = s.wordAdjustedToMatchCase ?? s.word;
							wordSuggestions.push({
								id: `replaceWith${s.word}`,
								range: issueRange,
								text: suggestionWord,
							});
							wordSuggestionTexts.push(suggestionWord);

							if (wordSuggestions.length >= MAX_WORD_SUGGESTIONS) {
								break;
							}
						}

						const data: Record<string, string> = {
							word: issue.text,
						};
						for (let i = 0; i < MAX_WORD_SUGGESTIONS; i++) {
							data[`replacement${i}`] = wordSuggestionTexts[i] ?? "";
						}

						context.report({
							data,
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
