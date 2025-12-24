import { textLanguage } from "@flint.fyi/text";
import { parseJsonSafe } from "@flint.fyi/utils";
import { checkFilenameMatchesGlob } from "cspell-lib";

import { createDocumentValidator } from "./createDocumentValidator.js";

interface CSpellConfigLike {
	words?: string[];
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
	async setup(context) {
		const { cspellSettings, documentValidator } =
			await createDocumentValidator();

		return {
			dependencies: ["cspell.json"],
			visitors: {
				file: (text, { filePathAbsolute }) => {
					if (
						cspellSettings.ignorePaths &&
						checkFilenameMatchesGlob(
							filePathAbsolute,
							cspellSettings.ignorePaths,
						)
					) {
						console.log("ignoring", filePathAbsolute);
						return;
					}

					const issues = documentValidator.checkText(
						[0, text.length],
						text,
						filePathAbsolute,
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
				},
			},
		};
	},
});
