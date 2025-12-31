import { RuleReporter } from "@flint.fyi/core";

import { setTSExtraSupportedExtensions } from "@flint.fyi/ts-patch";
import { createVolarBasedLanguage } from "@flint.fyi/volar-language";
import { svelteVolarLanguagePlugin } from "./volarLanguagePlugin.js";

setTSExtraSupportedExtensions([".svelte"]);

export interface SvelteServices {
	astroServices?: {
		reportComponent: RuleReporter<string>;
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
				return {
					// TODO: first statement
					firstStatementPosition: sourceText.length,
					extraContext(reportTranslated) {
						return {
							astroServices: {
								reportComponent: reportTranslated,
							},
						};
					},
				};
			},
		};
	},
);
