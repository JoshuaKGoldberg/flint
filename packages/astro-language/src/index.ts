import {
	LanguagePlugin as VolarLanguagePlugin,
	Language as VolarLanguage,
	Mapper as VolarMapper,
	CodegenContext as VolarCodegenContext,
} from "@volar/language-core";
import {
	AstroVirtualCode,
	getAstroLanguagePlugin,
} from "@astrojs/language-server/dist/core/index.js";
import {
	convertTypeScriptDiagnosticToLanguageFileDiagnostic,
	extractDirectivesFromTypeScriptFile,
	NodeSyntaxKinds,
	prepareTypeScriptBasedLanguage,
	prepareTypeScriptFile,
	TSNodesByName,
	TypeScriptBasedLanguageFile,
	TypeScriptFileServices,
} from "@flint.fyi/ts";
// for LanguagePlugin interface augmentation
import "@volar/typescript";
import { URI } from "vscode-uri";

import {
	CharacterReportRange,
	createLanguage,
	DirectivesCollector,
	getColumnAndLineOfPosition,
	isSuggestionForFiles,
	LanguagePreparedDefinition,
	NormalizedReport,
	NormalizedReportRangeObject,
	RuleContext,
	setTSExtraSupportedExtensions,
	setTSProgramCreationProxy,
	SourceFileWithLineMap,
} from "@flint.fyi/core";
import { proxyCreateProgram } from "@volar/typescript/lib/node/proxyCreateProgram.js";
import ts from "typescript";

type ProxiedTSProgram = ts.Program & {
	__flintVolarLanguage?: undefined | VolarLanguage<string>;
};

setTSExtraSupportedExtensions([".astro"]);
setTSProgramCreationProxy(
	(ts, createProgram) =>
		new Proxy(function () {} as unknown as typeof createProgram, {
			apply(target, thisArg, args) {
				let volarLanguage = null as null | VolarLanguage<string>;
				const proxied = proxyCreateProgram(ts, createProgram, (ts, options) => {
					const {
						getLanguageId,
						createVirtualCode,
						updateVirtualCode,
						disposeVirtualCode,
						isAssociatedFileOnly,
						typescript,
					} = getAstroLanguagePlugin();
					const languagePlugin: VolarLanguagePlugin<string, AstroVirtualCode> =
						{
							getLanguageId(scriptId) {
								return getLanguageId(URI.file(scriptId));
							},
							createVirtualCode(scriptId, languageId, snapshot) {
								// astro never touches ctx
								const ctx = {} as VolarCodegenContext<URI>;
								return createVirtualCode?.(
									URI.file(scriptId),
									languageId,
									snapshot,
									ctx,
								);
							},
							updateVirtualCode(scriptId, virtualCode, newSnapshot) {
								// astro never touches ctx
								const ctx = {} as VolarCodegenContext<URI>;
								return updateVirtualCode?.(
									URI.file(scriptId),
									virtualCode,
									newSnapshot,
									ctx,
								);
							},
							disposeVirtualCode(scriptId, virtualCode) {
								return disposeVirtualCode?.(URI.file(scriptId), virtualCode);
							},
							...(isAssociatedFileOnly != null && {
								isAssociatedFileOnly(scriptId, languageId): boolean {
									return isAssociatedFileOnly(URI.file(scriptId), languageId);
								},
							}),
							typescript,
						};
					if (languagePlugin.typescript != null) {
						const { getServiceScript } = languagePlugin.typescript;
						// getExtraServiceScripts() is not available in this use case.
						delete languagePlugin.typescript.getExtraServiceScripts;
						languagePlugin.typescript.getServiceScript = (root) => {
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
						languagePlugins: [languagePlugin],
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

export interface AstroServices extends TypeScriptFileServices {
	astroServices?: {
		// codegen: VueCodegen;
		// map: VolarMapper;
		// sfc: RootNode;
		// virtualCode: VueVirtualCode;
		// // TODO: can we type MessageId?
		// reportSfc: RuleReporter<string>;
	};
}

export const astroLanguage = createLanguage<TSNodesByName, AstroServices>({
	about: {
		name: "Astro",
	},
	prepare: () => {
		const tsLang = prepareTypeScriptBasedLanguage();

		return {
			prepareFromDisk: (filePathAbsolute) => {
				return prepareAstroFile(
					filePathAbsolute,
					tsLang.createFromDisk(filePathAbsolute),
				);
			},
			prepareFromVirtual: (filePathAbsolute, sourceText) => {
				return prepareAstroFile(
					filePathAbsolute,
					tsLang.createFromVirtual(filePathAbsolute, sourceText),
				);
			},
		};
	},
});

function prepareAstroFile(
	filePathAbsolute: string,
	tsFile: TypeScriptBasedLanguageFile,
): LanguagePreparedDefinition {
	const { program, sourceFile, [Symbol.dispose]: onDispose } = tsFile;

	// @ts-expect-error
	const volarLanguage: VolarLanguage = program.__flintVolarLanguage;

	if (volarLanguage == null) {
		throw new Error(
			"'typescript' package wasn't properly patched. Make sure you don't import 'typescript' before Flint.",
		);
	}

	const sourceScript = volarLanguage.scripts.get(filePathAbsolute);
	if (sourceScript == null) {
		throw new Error("Expected sourceScript to be set");
	}
	if (sourceScript.languageId !== "astro") {
		return prepareTypeScriptFile({
			program,
			sourceFile,
			[Symbol.dispose]: onDispose,
		});
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
	if (serviceScript == null) {
		throw new Error("Expected serviceScript to exist");
	}

	const virtualCode = sourceScript.generated.root as AstroVirtualCode;
	// const codegen = tsCodegen.get(virtualCode.sfc);
	// if (codegen == null) {
	// 	throw new Error("Expected codegen to exist");
	// }

	const map = volarLanguage.maps.get(serviceScript.code, sourceScript);
	const sortedMappings = map.mappings.toSorted(
		(a, b) => a.generatedOffsets[0] - b.generatedOffsets[0],
	);

	// const sfcAst = vueParse(sourceText, {
	// 	comments: true,
	// 	expressionPlugins: ["typescript"],
	// 	parseMode: "html",
	// 	// We ignore errors because virtual code already provides them,
	// 	// and it also provides them with sourceText-based locations,
	// 	// so we don't have to remap them. Oh, and it also contains errors from
	// 	// other blocks rather than only <template> as well.
	// 	// If we don't provide this callback, @vue/compiler-core will throw.
	// 	onError: () => {},
	// });

	return {
		file: {
			...(onDispose != null && { [Symbol.dispose]: onDispose }),
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
					// ...(virtualCode.vueSfc?.errors ?? []).map((e) => {
					// 	const fileName = sourceFile.fileName.startsWith("./")
					// 		? sourceFile.fileName.slice(2)
					// 		: sourceFile.fileName.slice(process.cwd().length + 1);
					// 	let code = "VUE";
					// 	let loc = "";
					// 	if ("code" in e) {
					// 		// TODO: think about codes
					// 		code += "999999" + e.code.toString();
					// 		loc =
					// 			e.loc != null
					// 				? `:${e.loc?.start.line}:${e.loc?.start.column}`
					// 				: "";
					// 	}
					// 	return {
					// 		code,
					// 		text: `${fileName}${loc} - ${code}: ${e.name} - ${e.message}`,
					// 	};
					// }),
				];
			},
			async runRule(rule, options) {
				const reports: NormalizedReport[] = [];
				const context: RuleContext<string> & AstroServices = {
					program,
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
								throw new Error("Suggestion range overlaps with virtual code");
							}
							suggestion.range = range;
						}

						reports.push(translatedReport);
					},
					sourceFile,
					typeChecker: program.getTypeChecker(),
					// vueServices: {
					// 	codegen,
					// 	map,
					// 	reportSfc: (report: RuleReport) => {
					// 		reports.push({
					// 			...report,
					// 			fix:
					// 				report.fix && !Array.isArray(report.fix)
					// 					? [report.fix]
					// 					: report.fix,
					// 			message: rule.messages[report.message],
					// 			range: normalizeSourceRange(report.range),
					// 		});
					// 	},
					// 	sfc: sfcAst,
					// 	virtualCode,
					// },
				};

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
		},
	};
}

function translateRange(
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
