import {
	CharacterReportRange,
	createLanguage,
	isSuggestionForFiles,
	NormalizedReport,
	RuleReport,
	Suggestion,
} from "@flint.fyi/core";
import {
	Mapper as VolarMapper,
	Language as VolarLanguage,
	LanguagePlugin as VolarLanguagePlugin,
	Mapping,
} from "@volar/language-core";
import {
	createGlobalTypesWriter as createGlobalVueTypesWriter,
	createVueLanguagePlugin,
	createParsedCommandLine as createVueParsedCommandLine,
	createParsedCommandLineByJson as createVueParsedCommandLineByJson,
	Sfc,
	VueVirtualCode,
} from "@vue/language-core";
import { RootNode } from "@vue/compiler-core";
// for LanguagePlugin interface augmentation
import "@volar/typescript";
import ts from "typescript";
import { VFile } from "vfile";
import { location } from "vfile-location";

import {
	TypeScriptServices,
	prepareTypeScriptBasedLanguage,
} from "../../ts/lib/language.js";
import { normalizeRange } from "../../ts/lib/normalizeRange.js";
import { vueLanguageParseContext } from "./setup-tests.js";
import {
	collectTypeScriptFileCacheImpacts,
	convertTypeScriptDiagnosticToLanguageFileDiagnostic,
	createTypeScriptFileFromProgram,
	runTypeScriptBasedLanguageRule,
} from "../../ts/lib/createTypeScriptFileFromProgram.js";
import { RuleReporter } from "@flint.fyi/core/src/types/context.js";

export interface VueServices extends TypeScriptServices {
	sfc: Sfc;
	templateAst: RootNode | null;
	// TODO: can we type MessageId?
	reportSfc: RuleReporter<string>;
	map: VolarMapper;
}

export const vueLanguage = createLanguage<unknown, VueServices>({
	about: {
		name: "Vue.js",
	},
	prepare: () => {
		const tsLang = prepareTypeScriptBasedLanguage();

		return {
			prepareFromDisk: () => {
				throw new Error("TODO: prepareFromDisk");
			},
			prepareFromVirtual: (filePathAbsolute, sourceText) => {
				const fileLocation = location(
					new VFile({
						path: filePathAbsolute,
						value: sourceText,
					}),
				);
				let volarLanguage = null as null | VolarLanguage<string>;
				function getLanguagePlugins(
					ts: typeof import("typescript"),
					options: ts.CreateProgramOptions,
				): {
					languagePlugins: VolarLanguagePlugin<string>[];
					setup?(language: VolarLanguage<string>): void;
				} {
					const { configFilePath } = options.options;
					const { vueOptions } =
						typeof configFilePath === "string"
							? createVueParsedCommandLine(
									ts,
									ts.sys,
									configFilePath.replaceAll("\\", "/"),
								)
							: createVueParsedCommandLineByJson(
									ts,
									ts.sys,
									(options.host ?? ts.sys).getCurrentDirectory(),
									{},
								);
					vueOptions.globalTypesPath = createGlobalVueTypesWriter(
						vueOptions,
						ts.sys.writeFile,
					);
					const vueLanguagePlugin = createVueLanguagePlugin<string>(
						ts,
						options.options,
						vueOptions,
						(id) => id,
					);
					if (vueLanguagePlugin.typescript != null) {
						const { getServiceScript } = vueLanguagePlugin.typescript;
						vueLanguagePlugin.typescript.getServiceScript = (root) => {
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
					}
					return {
						languagePlugins: [vueLanguagePlugin],
						setup: (lang) => (volarLanguage = lang),
					};
				}

				let templateAst = null as RootNode | null;

				const {
					program,
					sourceFile,
					[Symbol.dispose]: onDispose,
				} = vueLanguageParseContext.run(
					{
						getLanguagePlugins,
						setVueAst(ast, options) {
							// TODO: ts plugin creates VFS environment with this empty file
							// and later updates it
							if (ast.source === "// ...") {
								return;
							}
							// we don't interested in top-level SFC blocks parsing
							if (options.parseMode !== "html") {
								return;
							}
							templateAst = structuredClone(ast);
						},
					},
					() => {
						return tsLang.createFromVirtual(filePathAbsolute, sourceText);
					},
				);

				if (volarLanguage == null) {
					throw new Error(
						"'typescript' package wasn't properly patched. Make sure you don't import 'typescript' before Flint.",
					);
				}

				const sourceScript = volarLanguage.scripts.get(filePathAbsolute);
				if (sourceScript == null) {
					throw new Error("Expected sourceScript to be set");
				}
				if (sourceScript.generated == null) {
					throw new Error("Expected sourceScript.generated to be set");
				}
				if (sourceScript.snapshot == null) {
					throw new Error("Expected sourceScript.snapshot to be set");
				}
				if (sourceScript.generated.languagePlugin.typescript == null) {
					throw new Error(
						"Expected sourceScript.generated.languagePlugin.typescript to be set",
					);
				}

				const serviceScript =
					sourceScript.generated.languagePlugin.typescript.getServiceScript(
						sourceScript.generated.root,
					);
				if (serviceScript == null) {
					throw new Error("Expected serviceScript to exist");
				}

				const virtualCode = sourceScript.generated.root as VueVirtualCode;

				const map = volarLanguage.maps.get(serviceScript.code, sourceScript);

				// TODO: parsing errors
				// TODO: directives

				return {
					file: {
						...(onDispose != null && { [Symbol.dispose]: onDispose }),
						cache: collectTypeScriptFileCacheImpacts(program, sourceFile),
						getDiagnostics() {
							// TODO: report parse errors
							// TODO: transform ranges
							return ts
								.getPreEmitDiagnostics(program, sourceFile)
								.map(convertTypeScriptDiagnosticToLanguageFileDiagnostic);
						},
						async runRule(rule, options) {
							const translatedReports: NormalizedReport[] = [];
							const reports = await runTypeScriptBasedLanguageRule(
								program,
								sourceFile,
								rule,
								options,
								{
									sfc: virtualCode.sfc,
									templateAst,
									map,
									reportSfc: (report: RuleReport) => {
										const positionBegin = fileLocation.toPoint(
											report.range.begin,
										);
										if (positionBegin == null) {
											throw new Error("Invalid report.range.begin");
										}
										const positionEnd = fileLocation.toPoint(report.range.end);
										if (positionEnd == null) {
											throw new Error("Invalid report.range.begin");
										}
										translatedReports.push({
											...report,
											message: rule.messages[report.message],
											range: {
												begin: {
													line: positionBegin.line - 1,
													column: positionBegin.column - 1,
													raw: report.range.begin,
												},
												end: {
													line: positionEnd.line - 1,
													column: positionEnd.column - 1,
													raw: report.range.end,
												},
											},
										});
									},
								},
							);

							for (const report of reports) {
								const reportRange = translateRange(
									serviceScript.code.snapshot.getText(
										0,
										serviceScript.code.snapshot.getLength(),
									),
									map,
									report.range.begin.raw,
									report.range.end.raw,
								);
								if (reportRange == null) {
									continue;
								}

								const translatedReport: NormalizedReport = {
									...report,
									range: normalizeRange(reportRange, {
										text: sourceScript.snapshot.getText(
											0,
											sourceScript.snapshot.getLength(),
										),
									}),
								};
								if (report.suggestions != null) {
									translatedReport.suggestions =
										report.suggestions.map<Suggestion>((suggestion) => {
											if (isSuggestionForFiles(suggestion)) {
												throw new Error(
													"TODO: vue - suggestions for multiple files are not yet supported",
												);
											}
											const range = translateRange(
												serviceScript.code.snapshot.getText(
													0,
													serviceScript.code.snapshot.getLength(),
												),
												map,
												suggestion.range.begin,
												suggestion.range.end,
											);
											if (range == null) {
												// TODO: maybe we should filter out these suggestions intead of erroring?
												throw new Error(
													"Suggestion range overlaps with virtual code",
												);
											}
											return {
												...suggestion,
												range,
											};
										});
								}

								translatedReports.push(translatedReport);
							}

							return translatedReports;
						},
					},
				};
			},
		};
	},
});

export function translateRange(
	generated: string,
	map: VolarMapper,
	begin: number,
	end: number,
): { begin: number; end: number } | null {
	if (end < begin) {
		throw new Error("TODO");
	}
	// TODO(perf): binary search?

	// we don't care about mappings with two positions (are we right?)
	const mappings = map.mappings.filter(
		(m) => m.sourceOffsets.length === 1 && m.lengths[0] > 0,
	);

	let sourceBegin: number | null = null;

	for (const mapping of mappings) {
		const generatedLengths = mapping.generatedLengths ?? mapping.lengths;

		if (begin < mapping.generatedOffsets[0]) {
			// TODO: __VLS_dollars
			const a = "__VLS_ctx.";
			if (generated.slice(begin, mapping.generatedOffsets[0]) !== a) {
				return null;
			}
			if (end <= mapping.generatedOffsets[0]) {
				return null;
			}
			sourceBegin ??= mapping.sourceOffsets[0];
		} else if (begin < mapping.generatedOffsets[0] + generatedLengths[0]) {
			sourceBegin ??=
				mapping.sourceOffsets[0] + (begin - mapping.generatedOffsets[0]);
		} else {
			continue;
		}

		if (end <= mapping.generatedOffsets[0] + generatedLengths[0]) {
			return {
				begin: sourceBegin,
				end: mapping.sourceOffsets[0] + (end - mapping.generatedOffsets[0]),
			};
		}
		begin = mapping.generatedOffsets[0] + generatedLengths[0];
	}

	return null;
}
