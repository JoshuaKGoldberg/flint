import {
	AnyLevelDeep,
	flatten,
	RuleReporter,
	LanguageFileCacheImpacts,
	LanguageDiagnostics,
	FileReport,
	SourceFileWithLineMap,
	CharacterReportRange,
	NormalizedReportRangeObject,
	getColumnAndLineOfPosition,
	NormalizedReport,
	RuleContext,
	isSuggestionForFiles,
	Language,
	AnyRuleDefinition,
	CreateRule,
	DirectivesCollector,
} from "@flint.fyi/core";
import assert from "node:assert/strict";
import { setTSProgramCreationProxy } from "@flint.fyi/ts-patch";
import { proxyCreateProgram } from "@volar/typescript/lib/node/proxyCreateProgram.js";
// for LanguagePlugin interface augmentation
import "@volar/typescript";
import ts from "typescript";

import {
	convertTypeScriptDiagnosticToLanguageFileDiagnostic,
	DisposableTypeScriptFile,
	extractDirectivesFromTypeScriptFile,
	ExtractedDirective,
	NodeSyntaxKinds,
	setVolarPrepareFile,
	TSNodesByName,
	TypeScriptFileServices,
	typescriptLanguage,
} from "@flint.fyi/ts";

import {
	LanguagePlugin as VolarLanguagePlugin,
	Language as VolarLanguage,
	Mapper as VolarMapper,
	SourceScript as VolarSourceScript,
} from "@volar/language-core";
import { TypeScriptServiceScript as VolarTypeScriptServiceScript } from "@volar/typescript";
import { AsyncLocalStorage } from "node:async_hooks";

type VolarLanguagePluginInitializer<ContextServices extends object> = (
	ts: typeof import("typescript"),
	options: ts.CreateProgramOptions,
) => {
	languagePlugins: AnyLevelDeep<VolarLanguagePlugin<string>>;
	prepareFile: VolarBasedLanguagePrepareFile<ContextServices>;
};
const volarLanguagePluginInitializers = new Set<
	VolarLanguagePluginInitializer<object>
>();

type ProxiedTSProgram = ts.Program & {
	__flintVolarLanguage?: undefined | VolarLanguage<string>;
};

export type VolarBasedLanguagePrepareFile<ContextServices extends object> = (
	filePathAbsolute: string,
	tsFile: DisposableTypeScriptFile,
	volarLanguage: VolarLanguage,
	sourceScript: VolarSourceScript<string> & {
		generated: NonNullable<VolarSourceScript<string>["generated"]>;
	},
	serviceScript: VolarTypeScriptServiceScript,
) => {
	directives?: ExtractedDirective[];
	firstStatementPosition: number;
	reports?: FileReport[];
	cache?: LanguageFileCacheImpacts;
	getDiagnostics?(): LanguageDiagnostics;
	extraContext: (reportTranslated: RuleReporter<string>) => ContextServices;
};

type VolarLanguagePluginWithPrepareFile = VolarLanguagePlugin & {
	__flintPrepareFile?: VolarBasedLanguagePrepareFile<object> | undefined;
};

type CompilerHostSourceFileGetterStorage = { sourceFile: ts.SourceFile | null };
const compilerHostSourceFileGetterStorage =
	new AsyncLocalStorage<CompilerHostSourceFileGetterStorage>();

setTSProgramCreationProxy(
	(ts, createProgram) =>
		new Proxy(function () {} as unknown as typeof createProgram, {
			apply(target, thisArg, args) {
				let volarLanguage = null as null | VolarLanguage<string>;
				const createProgramProxy = new Proxy(createProgram, {
					apply(target, thisArg, [options]: [ts.CreateProgramOptions]) {
						assert.ok(options.host != null, `Flint bug: options.host is null`);
						const patchedGetSourceFile = options.host.getSourceFile;
						options.host.getSourceFile = (...args) => {
							const store: CompilerHostSourceFileGetterStorage = {
								sourceFile: null,
							};
							const result = compilerHostSourceFileGetterStorage.run(
								store,
								() => patchedGetSourceFile(...args),
							);
							if (result != null) {
								assert.ok(
									store.sourceFile,
									`Flint bug: sourceFile in compilerHostSourceFileGetterStorage expected to be set`,
								);
								assert.ok(
									"scriptKind" in store.sourceFile &&
										typeof store.sourceFile.scriptKind === "number",
									`Flint bug: ts.SourceFile doesn't have scriptKind property`,
								);
								assert.ok(
									"scriptKind" in result &&
										typeof result.scriptKind === "number",
									`Flint bug: ts.SourceFile doesn't have scriptKind property`,
								);
								store.sourceFile.scriptKind = result.scriptKind;
							}
							return result;
						};
						return Reflect.apply(target, thisArg, args);
					},
				});
				const proxied = proxyCreateProgram(
					ts,
					createProgramProxy,
					(ts, options) => {
						assert.ok(
							options.host != null,
							`Flint bug: createProgram was called without compiler host`,
						);
						const originalGetSourceFile = options.host.getSourceFile;
						options.host.getSourceFile = (...args) => {
							const file = originalGetSourceFile(...args);
							const store = compilerHostSourceFileGetterStorage.getStore();
							if (store != null && file != null) {
								store.sourceFile = file;
							}
							return file;
						};

						const languagePlugins = Array.from(volarLanguagePluginInitializers)
							.map((initializer) => initializer(ts, options))
							.map(({ languagePlugins, prepareFile }) =>
								flatten(languagePlugins).map((plugin) => {
									(
										plugin as VolarLanguagePluginWithPrepareFile
									).__flintPrepareFile = prepareFile;
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
					},
				);

				const program: ProxiedTSProgram = Reflect.apply(proxied, thisArg, args);

				assert.ok(volarLanguage != null, `Flint bug: volarLanguage is null`);

				if (program.__flintVolarLanguage == null) {
					program.__flintVolarLanguage = volarLanguage;
				}

				return program;
			},
		}),
);

setVolarPrepareFile(
	(
		filePathAbsolute,
		{ program, sourceFile, [Symbol.dispose]: disposeFile },
	) => {
		const volarLanguage = (program as ProxiedTSProgram).__flintVolarLanguage;
		assert.ok(
			volarLanguage != null,
			`Flint bug: TypeScript wasn't proxied with Volar.js`,
		);

		const sourceScript = volarLanguage.scripts.get(sourceFile.fileName);

		assert.ok(
			sourceScript != null,
			`Flint bug: Volar.js source script for ${sourceFile.fileName} is undefined`,
		);
		assert.ok(
			sourceScript.generated != null,
			`Flint bug: Volar.js sourceScript.generated for ${sourceFile.fileName} is undefined`,
		);
		assert.ok(
			sourceScript.generated.languagePlugin.typescript != null,
			`Flint bug: Volar.js sourceScript.generated.languagePlugin.typescript for ${sourceFile.fileName} is undefined`,
		);

		const prepareFile = (
			sourceScript.generated
				.languagePlugin as VolarLanguagePluginWithPrepareFile
		).__flintPrepareFile;
		assert.ok(
			prepareFile != null,
			`Flint bug: Volar.js language plugin for script (${sourceFile.fileName}) with language id ${sourceScript.generated.root.languageId} doesn't have __flintPrepareFile function`,
		);

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
				begin: getColumnAndLineOfPosition(sourceTextWithLineMap, range.begin),
				end: getColumnAndLineOfPosition(sourceTextWithLineMap, range.end),
			};
		}

		const serviceScript =
			sourceScript.generated.languagePlugin.typescript.getServiceScript(
				sourceScript.generated.root,
			);
		assert.ok(
			serviceScript != null,
			`Flint bug: Volar.js service script for ${sourceFile.fileName} is undefined`,
		);

		const map = volarLanguage.maps.get(serviceScript.code, sourceScript);
		const sortedMappings = map.mappings.toSorted(
			(a, b) => a.generatedOffsets[0] - b.generatedOffsets[0],
		);
		const {
			directives,
			firstStatementPosition,
			reports,
			extraContext,
			getDiagnostics,
			cache,
		} = prepareFile(
			filePathAbsolute,
			{
				program,
				sourceFile,
				[Symbol.dispose]: disposeFile,
			},
			volarLanguage,
			sourceScript as VolarSourceScript<string> & {
				generated: NonNullable<VolarSourceScript<string>["generated"]>;
			},
			serviceScript,
		);

		const translatedDirectives = [...(directives ?? [])];

		for (const d of extractDirectivesFromTypeScriptFile(sourceFile)) {
			const range = translateRange(map, d.range.begin.raw, d.range.end.raw);
			if (range != null) {
				translatedDirectives.push({
					...d,
					range: normalizeSourceRange(range),
				});
			}
		}

		const directivesCollector = new DirectivesCollector(firstStatementPosition);
		translatedDirectives.sort((a, b) => a.range.begin.raw - b.range.begin.raw);
		for (const { range, selection, type } of translatedDirectives) {
			directivesCollector.add(range, selection, type);
		}

		const collected = directivesCollector.collect();

		return {
			directives: collected.directives,
			reports: [...collected.reports, ...(reports ?? [])],
			file: {
				cache,
				getDiagnostics() {
					return [
						...ts.getPreEmitDiagnostics(program, sourceFile).map((diagnostic) =>
							convertTypeScriptDiagnosticToLanguageFileDiagnostic({
								...diagnostic,
								// For some unknown reason, Volar doesn't set file.text to sourceText
								// when preventLeadingOffset is true, so we have to do it ourselves
								// https://github.com/volarjs/volar.js/blob/4a9d25d797d08d9c149bebf0f52ac5e172f4757d/packages/typescript/lib/node/transform.ts#L102
								file: diagnostic.file
									? {
											fileName: diagnostic.file.fileName,
											text: sourceText,
										}
									: diagnostic.file,
							}),
						),
						...(getDiagnostics?.() ?? []),
					];
				},
				async runRule(rule, options) {
					const reports: NormalizedReport[] = [];
					const context = {
						program,
						sourceFile,
						typeChecker: program.getTypeChecker(),
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

							for (const suggestion of translatedReport.suggestions ?? []) {
								assert.ok(
									!isSuggestionForFiles(suggestion),
									`Flint bug: suggestions for multiple files in Volar.js based languages are not yet supported`,
								);
								const range = translateRange(
									map,
									suggestion.range.begin,
									suggestion.range.end,
								);
								// TODO: maybe we should filter out these suggestions intead of erroring?
								assert.ok(
									range != null,
									`Flint rule bug: suggestion ranges must not overlap with virtual code`,
								);
								suggestion.range = range;
							}

							reports.push(translatedReport);
						},
						...extraContext?.((report) => {
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
						Statements: for (const statement of sourceFile.statements) {
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
										currentMapping.generatedOffsets[0] + currentMappingLength
								) {
									lastMappingIdx++;
									continue;
								}
								if (statement.end <= currentMapping.generatedOffsets[0]) {
									continue Statements;
								}
								break;
							}

							visit(statement);
						}
						visit(sourceFile.endOfFileToken);
					}

					await runtime?.teardown?.();

					return reports;
				},
				[Symbol.dispose]() {
					disposeFile?.();
				},
			},
		};
	},
);

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

export function createVolarBasedLanguage<ContextServices extends object>(
	initializer: VolarLanguagePluginInitializer<ContextServices>,
) {
	volarLanguagePluginInitializers.add(initializer);
	const language: Language<
		TSNodesByName,
		Partial<ContextServices> & TypeScriptFileServices
	> = {
		about: {
			name: "Volar.js-based language",
		},
		createRule: (ruleDefinition: AnyRuleDefinition) => {
			return {
				...ruleDefinition,
				// @ts-expect-error - ContextServices type is not satisfied, but we pass correct
				// services in runRule
				language: typescriptLanguage as Language<
					TSNodesByName,
					Partial<ContextServices> & TypeScriptFileServices
				>,
			};
		},
		prepare() {
			throw new Error(
				"Flint bug: Volar.js based language should never be prepared directly",
			);
		},
	};

	return language;
}
