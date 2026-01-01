import { RuleReporter } from "@flint.fyi/core";

import { setTSExtraSupportedExtensions } from "@flint.fyi/ts-patch";
import { createVolarBasedLanguage } from "@flint.fyi/volar-language";
import { svelteVolarLanguagePlugin } from "./volarLanguagePlugin.js";
import { AST, parse } from "svelte/compiler";

setTSExtraSupportedExtensions([".svelte"]);

export interface SvelteServices {
	svelteServices?: {
		ast: AST.Root;
		reportComponent: RuleReporter<string>;
		sourceText: string;
	};
}

export const svelteLanguage = createVolarBasedLanguage<SvelteServices>(
	(ts, options) => {
		return {
			languagePlugins: svelteVolarLanguagePlugin,
			prepareFile(
				filePathAbsolute,
				{ program, sourceFile },
				volarLanguage,
				sourceScript,
				serviceScript,
			) {
				const sourceText = sourceScript.snapshot.getText(
					0,
					sourceScript.snapshot.getLength(),
				);
				// TODO: report parsing errors?
				const ast = parse(sourceText, {
					modern: true,
				});
				return {
					// TODO: first statement
					firstStatementPosition: sourceText.length,
					extraContext(reportTranslated) {
						return {
							svelteServices: {
								ast,
								reportComponent: reportTranslated,
								sourceText,
							},
						};
					},
				};
			},
		};
	},
);
