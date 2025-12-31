import { getLanguagePlugin } from "@astrojs/ts-plugin/dist/language.js";

import { RuleReporter } from "@flint.fyi/core";

import { setTSExtraSupportedExtensions } from "@flint.fyi/ts-patch";
import { createVolarBasedLanguage } from "@flint.fyi/volar-language";

setTSExtraSupportedExtensions([".astro"]);

export interface AstroServices {
	astroServices?: {
		reportComponent: RuleReporter<string>;
	};
}

export const astroLanguage = createVolarBasedLanguage<AstroServices>(
	(ts, options) => {
		return {
			languagePlugins: getLanguagePlugin(),
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
