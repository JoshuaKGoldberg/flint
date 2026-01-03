import { getLanguagePlugin } from "@astrojs/ts-plugin/dist/language.js";
import { parse } from "@astrojs/compiler/sync";
import { RootNode } from "@astrojs/compiler/types";

import { RuleReporter } from "@flint.fyi/core";

import { setTSExtraSupportedExtensions } from "@flint.fyi/ts-patch";
import { createVolarBasedLanguage } from "@flint.fyi/volar-language";

setTSExtraSupportedExtensions([".astro"]);

export interface AstroServices {
	astroServices?: {
		ast: RootNode;
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
			) {
				const sourceText = sourceScript.snapshot.getText(
					0,
					sourceScript.snapshot.getLength(),
				);
				// TODO: report parsing errors?
				const { ast } = parse(sourceText, { position: true });
				return {
					// TODO: first statement
					firstStatementPosition: sourceText.length,
					extraContext(reportTranslated) {
						return {
							astroServices: {
								ast,
								reportComponent: reportTranslated,
							},
						};
					},
				};
			},
		};
	},
);
