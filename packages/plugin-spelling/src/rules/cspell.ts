import { RuleBuilder } from "@flint.fyi/core";
import { textLanguage } from "@flint.fyi/text";
import { parseJsonSafe } from "@flint.fyi/utils";

import { createDocumentValidator } from "./createDocumentValidator.js";

interface CSpellConfigLike {
	words?: string[];
}

export default textLanguage
	.buildRule()
	.pipe(
		RuleBuilder.about({
			description: "Runs the CSpell spell checker on any source code file.",
			id: "cspell",
			preset: "logical",
		}),
	)
	.pipe(
		RuleBuilder.messages({
			issue: {
				primary: 'Forbidden or unknown word: "{{ word }}".',
				secondary: ["TODO"],
				suggestions: ["TODO"],
			},
		}),
	)
	.pipe(RuleBuilder.dependencies(["cspell.json"]))
	.pipe(
		RuleBuilder.stateful(async (context) => {
			const documentValidator = await createDocumentValidator(
				context.filePathAbsolute,
				context.sourceText,
			);

			return { documentValidator };
		}),
	)
	.build(() => ({
		file: (text, context) => {
			if (!context.documentValidator) {
				return;
			}

			const issues = context.documentValidator.checkText(
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
		},
	}));
