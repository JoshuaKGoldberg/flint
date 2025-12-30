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
	RuleReport,
	RuleReporter,
	setTSExtraSupportedExtensions,
	setTSProgramCreationProxy,
	SourceFileWithLineMap,
} from "@flint.fyi/core";
import {
	Language as VolarLanguage,
	Mapper as VolarMapper,
} from "@volar/language-core";
import {
	parse as vueParse,
	NodeTypes,
	RootNode,
	TemplateChildNode,
} from "@vue/compiler-dom";
import {
	createVueLanguagePlugin,
	createParsedCommandLine as createVueParsedCommandLine,
	createParsedCommandLineByJson as createVueParsedCommandLineByJson,
	tsCodegen,
	VueCompilerOptions,
	VueVirtualCode,
} from "@vue/language-core";
import {
	collectTypeScriptFileCacheImpacts,
	convertTypeScriptDiagnosticToLanguageFileDiagnostic,
	createTypeScriptBasedLanguage,
	extractDirectivesFromTypeScriptFile,
	NodeSyntaxKinds,
	prepareTypeScriptBasedLanguage,
	prepareTypeScriptFile,
	TSNodesByName,
	TypeScriptBasedLanguageFile,
	TypeScriptFileServices,
} from "@flint.fyi/ts";
import ts from "typescript";

// TODO: css

setTSExtraSupportedExtensions([".vue"]);
// setTSProgramCreationProxy(
// 	(ts, createProgram) =>
// 		new Proxy(function () {} as unknown as typeof createProgram, {
// 			apply(target, thisArg, args) {
// 				let volarLanguage = null as null | VolarLanguage<string>;
// 				let vueCompilerOptions = null as null | VueCompilerOptions;
// 				const proxied = proxyCreateProgram(ts, createProgram, (ts, options) => {
// 					const { configFilePath } = options.options;
// 					vueCompilerOptions = (
// 						typeof configFilePath === "string"
// 							? createVueParsedCommandLine(
// 									ts,
// 									ts.sys,
// 									configFilePath.replaceAll("\\", "/"),
// 								)
// 							: createVueParsedCommandLineByJson(
// 									ts,
// 									ts.sys,
// 									(options.host ?? ts.sys).getCurrentDirectory(),
// 									{},
// 								)
// 					).vueOptions;
// 					const vueLanguagePlugin = createVueLanguagePlugin<string>(
// 						ts,
// 						options.options,
// 						vueCompilerOptions,
// 						(id) => id,
// 					);
// 					if (vueLanguagePlugin.typescript != null) {
// 						const { getServiceScript } = vueLanguagePlugin.typescript;
// 						vueLanguagePlugin.typescript.getServiceScript = (root) => {
// 							const script = getServiceScript(root);
// 							if (script == null) {
// 								return script;
// 							}
// 							return {
// 								...script,
// 								// Leading offset is useful for LanguageService [1], but we don't use it.
// 								// The Vue language plugin doesn't provide preventLeadingOffset [2], so we
// 								// have to provide it ourselves.
// 								//
// 								// [1] https://github.com/volarjs/volar.js/discussions/188
// 								// [2] https://github.com/vuejs/language-tools/blob/fd05a1c92c9af63e6af1eab926084efddf7c46c3/packages/language-core/lib/languagePlugin.ts#L113-L130
// 								preventLeadingOffset: true,
// 							};
// 						};
// 					}
// 					return {
// 						languagePlugins: [vueLanguagePlugin],
// 						setup: (lang) => (volarLanguage = lang),
// 					};
// 				});
//
// 				const program: ProxiedTSProgram = Reflect.apply(proxied, thisArg, args);
//
// 				if (volarLanguage == null) {
// 					throw new Error("Flint bug: volarLanguage is not defined");
// 				}
// 				if (vueCompilerOptions == null) {
// 					throw new Error("Flint bug: vueCompilerOptions is not defined");
// 				}
//
// 				if (program.__flintVolarLanguage != null) {
// 					return program;
// 				}
//
// 				program.__flintVolarLanguage = volarLanguage;
// 				return program;
// 			},
// 		}),
// );

export interface VueServices extends TypeScriptFileServices {
	vueServices?: {
		codegen: VueCodegen;
		map: VolarMapper;
		sfc: RootNode;
		virtualCode: VueVirtualCode;
		// TODO: can we type MessageId?
		reportSfc: RuleReporter<string>;
	};
}

type VueCodegen = typeof tsCodegen extends WeakMap<any, infer V> ? V : never;

export const vueLanguage = createTypeScriptBasedLanguage<
	TSNodesByName,
	VueServices
>((ts, options) => {
	const { configFilePath } = options.options;
	const vueCompilerOptions = (
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
				)
	).vueOptions;
	return {
		languagePlugins: createVueLanguagePlugin(
			ts,
			options.options,
			vueCompilerOptions,
			(id) => id,
		),
		prepareFile(filePathAbsolute, tsFile) {
			return prepareVueFile(filePathAbsolute, tsFile);
		},
	};
});

export const _vueLanguage = createLanguage<TSNodesByName, VueServices>({
	about: {
		name: "Vue.js",
	},
	prepare: () => {
		const tsLang = prepareTypeScriptBasedLanguage();

		return {
			prepareFromDisk: (filePathAbsolute) => {
				return prepareVueFile(
					filePathAbsolute,
					tsLang.createFromDisk(filePathAbsolute),
				);
			},
			prepareFromVirtual: (filePathAbsolute, sourceText) => {
				return prepareVueFile(
					filePathAbsolute,
					tsLang.createFromVirtual(filePathAbsolute, sourceText),
				);
			},
		};
	},
});

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

// TODO:
// export function vueWrapRules(
// 	...rules: AnyLevelDeep<ConfigRuleDefinition>[]
// ): AnyRule[] {
// 	return Array.from(
// 		computeRulesWithOptions(flatten(rules))
// 			.keys()
// 			.map((rule) => vueLanguage.createRule(rule)),
// 	);
// }

function prepareVueFile(
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
	if (sourceScript.languageId !== "vue") {
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

	const virtualCode = sourceScript.generated.root as VueVirtualCode;
	const codegen = tsCodegen.get(virtualCode.sfc);
	if (codegen == null) {
		throw new Error("Expected codegen to exist");
	}

	const map = volarLanguage.maps.get(serviceScript.code, sourceScript);
	const sortedMappings = map.mappings.toSorted(
		(a, b) => a.generatedOffsets[0] - b.generatedOffsets[0],
	);

	const sfcAst = vueParse(sourceText, {
		comments: true,
		expressionPlugins: ["typescript"],
		parseMode: "html",
		// We ignore errors because virtual code already provides them,
		// and it also provides them with sourceText-based locations,
		// so we don't have to remap them. Oh, and it also contains errors from
		// other blocks rather than only <template> as well.
		// If we don't provide this callback, @vue/compiler-core will throw.
		onError: () => {},
	});

	// TODO: extract directives from other blocks too

	const directives: {
		range: NormalizedReportRangeObject;
		selection: string;
		type: string;
	}[] = [];
	function visitTemplate(elem: TemplateChildNode) {
		if (elem.type === NodeTypes.ELEMENT) {
			elem.children.forEach(visitTemplate);
			return;
		}
		if (elem.type !== NodeTypes.COMMENT) {
			return;
		}
		const match = /\s*flint-(\S+)(?:\s+(.+))?/.exec(elem.content);
		if (match == null) {
			return;
		}
		const [, type, selection] = match;
		directives.push({
			range: {
				begin: {
					column: elem.loc.start.column - 1,
					line: elem.loc.start.line - 1,
					raw: elem.loc.start.offset,
				},
				end: {
					column: elem.loc.end.column - 1,
					line: elem.loc.end.line - 1,
					raw: elem.loc.end.offset,
				},
			},
			selection,
			type,
		});
	}
	sfcAst.children.forEach(visitTemplate);

	for (const d of extractDirectivesFromTypeScriptFile(sourceFile)) {
		const range = translateRange(map, d.range.begin.raw, d.range.end.raw);
		if (range != null) {
			directives.push({
				...d,
				range: normalizeSourceRange(range),
			});
		}
	}

	const directivesCollector = new DirectivesCollector(
		sfcAst.children.find((c) => c.type !== NodeTypes.COMMENT)?.loc.start
			.offset ?? sourceText.length,
	);
	directives.sort((a, b) => a.range.begin.raw - b.range.begin.raw);
	for (const { range, selection, type } of directives) {
		directivesCollector.add(range, selection, type);
	}

	return {
		...directivesCollector.collect(),
		file: {
			...(onDispose != null && { [Symbol.dispose]: onDispose }),
			cache: collectTypeScriptFileCacheImpacts(program, sourceFile),
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
					...(virtualCode.vueSfc?.errors ?? []).map((e) => {
						const fileName = sourceFile.fileName.startsWith("./")
							? sourceFile.fileName.slice(2)
							: sourceFile.fileName.slice(process.cwd().length + 1);
						let code = "VUE";
						let loc = "";
						if ("code" in e) {
							// TODO: think about codes
							code += "999999" + e.code.toString();
							loc =
								e.loc != null
									? `:${e.loc?.start.line}:${e.loc?.start.column}`
									: "";
						}
						return {
							code,
							text: `${fileName}${loc} - ${code}: ${e.name} - ${e.message}`,
						};
					}),
				];
			},
			async runRule(rule, options) {
				const reports: NormalizedReport[] = [];
				const context: RuleContext<string> & VueServices = {
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
					vueServices: {
						codegen,
						map,
						reportSfc: (report: RuleReport) => {
							reports.push({
								...report,
								fix:
									report.fix && !Array.isArray(report.fix)
										? [report.fix]
										: report.fix,
								message: rule.messages[report.message],
								range: normalizeSourceRange(report.range),
							});
						},
						sfc: sfcAst,
						virtualCode,
					},
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
