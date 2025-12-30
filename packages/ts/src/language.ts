import {
	AnyLevelDeep,
	AnyRuleDefinition,
	flatten,
	createLanguage,
	Language,
	setTSProgramCreationProxy,
	LanguagePreparedDefinition,
	RuleReporter,
	LanguageFileCacheImpacts,
	LanguageDiagnostics,
	CommentDirective,
	NormalizedReport,
	RuleContext,
	FileReport,
	SourceFileWithLineMap,
	CharacterReportRange,
	NormalizedReportRangeObject,
	getColumnAndLineOfPosition,
	RuleReport,
	isSuggestionForFiles,
} from "@flint.fyi/core";
import * as ts from "typescript";
import {
	LanguagePlugin as VolarLanguagePlugin,
	Language as VolarLanguage,
	Mapper as VolarMapper,
	SourceScript as VolarSourceScript,
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
import { NodeSyntaxKinds } from "./createTypeScriptFileFromProgram.js";

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
		sourceScript: VolarSourceScript<string> & {
			generated: NonNullable<VolarSourceScript<string>["generated"]>;
		},
	) => {
		directives?: CommentDirective[];
		reports?: FileReport[];
		cache?: LanguageFileCacheImpacts;
		getDiagnostics?(): LanguageDiagnostics;
		extraContext?: (
			reportTranslated: RuleReporter<string>,
		) => Record<string, unknown>;
	};
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
						if (sourceScript.generated != null && prepareFile != null) {
							if (sourceScript.snapshot == null) {
								throw new Error("Expected sourceScript.snapshot to be set");
							}
							if (sourceScript.generated.languagePlugin.typescript == null) {
								throw new Error(
									"Expected sourceScript.generated.languagePlugin.typescript to be set",
								);
							}

							const sourceText = sourceScript.snapshot.getText(
								0,
								sourceScript.snapshot.getLength(),
							);
							const sourceTextWithLineMap: SourceFileWithLineMap = {
								text: sourceText,
							};
							function normalizeSourceRange(
								range: CharacterReportRange,
							): NormalizedReportRangeObject {
								return {
									begin: getColumnAndLineOfPosition(
										sourceTextWithLineMap,
										range.begin,
									),
									end: getColumnAndLineOfPosition(
										sourceTextWithLineMap,
										range.end,
									),
								};
							}

							const serviceScript =
								sourceScript.generated.languagePlugin.typescript.getServiceScript(
									sourceScript.generated.root,
								);
							if (serviceScript == null) {
								throw new Error("Expected serviceScript to exist");
							}

							const map = volarLanguage.maps.get(
								serviceScript.code,
								sourceScript,
							);
							const sortedMappings = map.mappings.toSorted(
								(a, b) => a.generatedOffsets[0] - b.generatedOffsets[0],
							);
							const {
								directives,
								reports,
								extraContext,
								getDiagnostics,
								cache,
							} = (
								prepareFile as ReturnType<VolarLanguagePluginInitializer>["prepareFile"]
							)(filePathAbsolute, tsFile, sourceScript);

							return {
								directives,
								reports,
								file: {
									cache,
									getDiagnostics,
									async runRule(rule, options) {
										const reports: NormalizedReport[] = [];
										const context = {
											program: tsFile.program,
											sourceFile: tsFile.sourceFile,
											typeChecker: tsFile.program.getTypeChecker(),
											report: (report) => {
												const reportRange = translateRange(
													map,
													report.range.begin,
													report.range.end,
												);
												if (reportRange == null) {
													return;
												}

												const translatedReport: NormalizedReport = {
													...report,
													fix:
														report.fix && !Array.isArray(report.fix)
															? [report.fix]
															: report.fix,
													message: rule.messages[report.message],
													range: normalizeSourceRange(reportRange),
												};

												for (const suggestion of translatedReport.suggestions ??
													[]) {
													if (isSuggestionForFiles(suggestion)) {
														throw new Error(
															"TODO: vue - suggestions for multiple files are not yet supported",
														);
													}
													const range = translateRange(
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
													suggestion.range = range;
												}

												reports.push(translatedReport);
											},
											...extraContext?.((report: RuleReport) => {
												reports.push({
													...report,
													fix:
														report.fix && !Array.isArray(report.fix)
															? [report.fix]
															: report.fix,
													message: rule.messages[report.message],
													range: normalizeSourceRange(report.range),
												});
											}),
										} satisfies TypeScriptFileServices & RuleContext<string>;

										const runtime = await rule.setup(context, options);

										if (runtime?.visitors) {
											const { visitors } = runtime;
											let lastMappingIdx = 0;
											const visit = (node: ts.Node) => {
												visitors[NodeSyntaxKinds[node.kind]]?.(node, context);

												node.forEachChild(visit);
											};
											// Visit only statements that have a mapping to the source code
											// to avoid doing extra work
											Statements: for (const statement of tsFile.sourceFile
												.statements) {
												while (true) {
													const currentMapping = sortedMappings[lastMappingIdx];
													if (currentMapping == null) {
														break Statements;
													}
													const currentMappingLength =
														currentMapping.generatedLengths?.[0] ??
														currentMapping.lengths[0];
													if (
														currentMappingLength === 0 ||
														statement.pos >=
															currentMapping.generatedOffsets[0] +
																currentMappingLength
													) {
														lastMappingIdx++;
														continue;
													}
													if (
														statement.end <= currentMapping.generatedOffsets[0]
													) {
														continue Statements;
													}
													break;
												}

												visit(statement);
											}
											visit(tsFile.sourceFile.endOfFileToken);
										}

										await runtime?.teardown?.();

										return reports;
									},
									[Symbol.dispose]() {
										tsFile[Symbol.dispose]?.();
									},
								},
							};
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

export function translateRange(
	map: VolarMapper,
	serviceBegin: number,
	serviceEnd: number,
): null | { begin: number; end: number } {
	for (const [begin, end] of map.toSourceRange(
		serviceBegin,
		serviceEnd,
		true,
	)) {
		if (begin === end) {
			continue;
		}
		return { begin, end };
	}
	return null;
}
