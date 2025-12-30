import {
	AnyLevelDeep,
	AnyRuleDefinition,
	flatten,
	createLanguage,
	Language,
	setTSProgramCreationProxy,
	LanguagePreparedDefinition,
} from "@flint.fyi/core";
import * as ts from "typescript";
import {
	LanguagePlugin as VolarLanguagePlugin,
	Language as VolarLanguage,
} from "@volar/language-core";

import { TSNodesByName } from "./nodes.js";
import {
	prepareTypeScriptBasedLanguage,
	TypeScriptBasedLanguageFile,
} from "./prepareTypeScriptBasedLanguage.js";
import { prepareTypeScriptFile } from "./prepareTypeScriptFile.js";
import { proxyCreateProgram } from "@volar/typescript/lib/node/proxyCreateProgram.js";

// for LanguagePlugin interface augmentation
import "@volar/typescript";

export interface TypeScriptFileServices {
	program: ts.Program;
	sourceFile: ts.SourceFile;
	typeChecker: ts.TypeChecker;
}

type VolarLanguagePluginInitializer = (
	ts: typeof import("typescript"),
	options: ts.CreateProgramOptions,
) => {
	languagePlugins: AnyLevelDeep<VolarLanguagePlugin<string>>;
	prepareFile: (
		filePathAbsolute: string,
		tsFile: TypeScriptBasedLanguageFile,
	) => LanguagePreparedDefinition;
};
const volarLanguagePluginInitializers =
	new Set<VolarLanguagePluginInitializer>();

type ProxiedTSProgram = ts.Program & {
	__flintVolarLanguage?: undefined | VolarLanguage<string>;
};

setTSProgramCreationProxy(
	(ts, createProgram) =>
		new Proxy(function () {} as unknown as typeof createProgram, {
			apply(target, thisArg, args) {
				let volarLanguage = null as null | VolarLanguage<string>;
				const proxied = proxyCreateProgram(ts, createProgram, (ts, options) => {
					const languagePlugins = Array.from(volarLanguagePluginInitializers)
						.map((initializer) => initializer(ts, options))
						.map(({ languagePlugins, prepareFile }) =>
							flatten(languagePlugins).map((plugin) => {
								plugin.__flintPrepareFile = prepareFile;
								if (plugin.typescript == null) {
									return plugin;
								}

								const { getServiceScript } = plugin.typescript;
								plugin.typescript.getServiceScript = (root) => {
									const script = getServiceScript(root);
									if (script == null) {
										return script;
									}
									return {
										...script,
										// Leading offset is useful for LanguageService [1], but we don't use it.
										// The Vue language plugin doesn't provide preventLeadingOffset [2], so we
										// have to provide it ourselves.
										//
										// [1] https://github.com/volarjs/volar.js/discussions/188
										// [2] https://github.com/vuejs/language-tools/blob/fd05a1c92c9af63e6af1eab926084efddf7c46c3/packages/language-core/lib/languagePlugin.ts#L113-L130
										preventLeadingOffset: true,
									};
								};

								return plugin;
							}),
						);
					return {
						languagePlugins: flatten(languagePlugins),
						setup: (lang) => (volarLanguage = lang),
					};
				});

				const program: ProxiedTSProgram = Reflect.apply(proxied, thisArg, args);

				if (volarLanguage == null) {
					throw new Error("Flint bug: volarLanguage is not defined");
				}

				if (program.__flintVolarLanguage != null) {
					return program;
				}

				program.__flintVolarLanguage = volarLanguage;
				return program;
			},
		}),
);

export const typescriptLanguage = createLanguage<
	TSNodesByName,
	TypeScriptFileServices
>({
	about: {
		name: "TypeScript",
	},
	prepare: (host) => {
		const lang = prepareTypeScriptBasedLanguage(host);

		return {
			prepareFile(filePathAbsolute) {
				const tsFile = lang.createFile(filePathAbsolute);

				const volarLanguage = (tsFile.program as ProxiedTSProgram)
					.__flintVolarLanguage;

				if (volarLanguage != null) {
					const sourceScript = volarLanguage.scripts.get(
						tsFile.sourceFile.fileName,
					);

					if (sourceScript != null) {
						const prepareFile =
							sourceScript.generated?.languagePlugin?.__flintPrepareFile;
						if (prepareFile != null) {
							return prepareFile(filePathAbsolute, tsFile);
						}
					}
				}

				return prepareTypeScriptFile(tsFile);
			},
		};
	},
});

export function createTypeScriptBasedLanguage<
	AstNodesByName,
	ContextServices extends object,
>(initializer: VolarLanguagePluginInitializer) {
	volarLanguagePluginInitializers.add(initializer);
	const language: Language<AstNodesByName, ContextServices> = {
		createRule: (ruleDefinition: AnyRuleDefinition) => {
			return {
				...ruleDefinition,
				language: typescriptLanguage,
			};
		},

		prepare(host) {
			throw new Error(
				"Flint bug: TypeScript based language should never be prepared",
			);
		},
	};

	return language;
}
