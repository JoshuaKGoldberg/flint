import {
	AnyLevelDeep,
	AnyRule,
	computeRulesWithOptions,
	ConfigRuleDefinition,
	createLanguage,
	DirectivesCollector,
	flatten,
	isSuggestionForFiles,
	LanguagePreparedDefinition,
	NormalizedReport,
	NormalizedReportRangeObject,
	RuleReport,
	RuleReporter,
	setTSExtraSupportedExtensions,
	setTSProgramCreationProxy,
	Suggestion,
} from "@flint.fyi/core";
import {
	VirtualCode,
	Language as VolarLanguage,
	Mapper as VolarMapper,
} from "@volar/language-core";
import { NodeTypes, RootNode, TemplateChildNode } from "@vue/compiler-core";
import { parse as vueParse } from "@vue/compiler-dom";
import {
	createGlobalTypesWriter as createGlobalVueTypesWriter,
	createVueLanguagePlugin,
	createParsedCommandLine as createVueParsedCommandLine,
	createParsedCommandLineByJson as createVueParsedCommandLineByJson,
	Sfc,
	tsCodegen,
	VueCompilerOptions,
	VueVirtualCode,
} from "@vue/language-core";
// for LanguagePlugin interface augmentation
import "@volar/typescript";
import {
	collectTypeScriptFileCacheImpacts,
	convertTypeScriptDiagnosticToLanguageFileDiagnostic,
	extractDirectivesFromTypeScriptFile,
	normalizeRange,
	prepareTypeScriptBasedLanguage,
	prepareTypeScriptFile,
	runTypeScriptBasedLanguageRule,
	TSNodesByName,
	ts as tsPlugin,
	TypeScriptBasedLanguageFile,
	TypeScriptServices,
} from "@flint.fyi/ts";
import { proxyCreateProgram } from "@volar/typescript/lib/node/proxyCreateProgram.js";
import ts from "typescript";
import { VFile } from "vfile";
import { location } from "vfile-location";

type ProxiedTSProgram = ts.Program & {
	__flintVolarLanguage?: undefined | VolarLanguage<string>;
};

// TODO: css

setTSExtraSupportedExtensions([".vue"]);
setTSProgramCreationProxy(
	(ts, createProgram) =>
		new Proxy(function () {} as unknown as typeof createProgram, {
			apply(target, thisArg, args) {
				let volarLanguage = null as null | VolarLanguage<string>;
				let vueCompilerOptions = null as null | VueCompilerOptions;
				let globalTypesErrorForFile = null as null | string;
				const proxied = proxyCreateProgram(ts, createProgram, (ts, options) => {
					const { configFilePath } = options.options;
					vueCompilerOptions = (
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
					const globalTypesPath = createGlobalVueTypesWriter(
						vueCompilerOptions,
						ts.sys.writeFile,
					);
					vueCompilerOptions.globalTypesPath = (fileName) => {
						const result = globalTypesPath(fileName);
						if (result == null) {
							globalTypesErrorForFile ??= fileName;
						}
						return result;
					};
					const vueLanguagePlugin = createVueLanguagePlugin<string>(
						ts,
						options.options,
						vueCompilerOptions,
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
				});

				const program: ProxiedTSProgram = Reflect.apply(proxied, thisArg, args);

				if (volarLanguage == null) {
					throw new Error("Flint bug: volarLanguage is not defined");
				}
				if (vueCompilerOptions == null) {
					throw new Error("Flint bug: vueCompilerOptions is not defined");
				}

				if (program.__flintVolarLanguage != null) {
					return program;
				}

				program.__flintVolarLanguage = volarLanguage;
				const getGlobalDiagnostics = program.getGlobalDiagnostics;
				program.getGlobalDiagnostics = (...args) => {
					const diagnostics = [...getGlobalDiagnostics(...args)];

					if (globalTypesErrorForFile != null) {
						diagnostics.push({
							category: ts.DiagnosticCategory.Warning,
							file: undefined,
							length: 0,
							start: 0,
							// TODO: If no Vue rules are used, the Vue language isn't prepared,
							// and its diagnostics are not collected. In this case, the only
							// channel to report errors is through TS program diagnostics.
							// But this forces us to write imaginary TS error code here. Maybe
							// a better solution would be to introduce a secondary diagnostics
							// reporting channel, or to introduce some special _magic_ TS error
							// code which will be handled in a special way by
							// convertTypeScriptDiagnosticToLanguageFileDiagnostic
							code: 99999999,
							messageText: `
Failed to write the global types file for '${globalTypesErrorForFile}'. Make sure that:

1. 'node_modules' directory exists.
2. '${vueCompilerOptions!.lib}' is installed as a direct dependency.

Alternatively, you can manually set "vueCompilerOptions.globalTypesPath" in your "tsconfig.json" or "jsconfig.json".
						`.trim(),
						});
					}

					return diagnostics;
				};
				return program;
			},
		}),
);

export interface VueServices extends TypeScriptServices {
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

export const vueLanguage = createLanguage<TSNodesByName, VueServices>({
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

export function translateRange(
	generated: string,
	map: VolarMapper,
	begin: number,
	end: number,
): null | { begin: number; end: number } {
	if (end < begin) {
		throw new Error("TODO");
	}
	// TODO(perf): binary search?

	// we don't care about mappings with two positions (are we right?)
	const mappings = map.mappings.filter(
		(m) => m.sourceOffsets.length === 1 && m.lengths[0] > 0,
	);

	let sourceBegin: null | number = null;

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

export function vueWrapRules(
	...rules: AnyLevelDeep<ConfigRuleDefinition>[]
): AnyRule[] {
	return Array.from(
		computeRulesWithOptions(flatten(rules))
			.keys()
			.map((rule) => vueLanguage.createRule(rule)),
	);
}

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
	const fileLocation = location(
		new VFile({
			path: filePathAbsolute,
			value: sourceText,
		}),
	);

	const serviceScript =
		sourceScript.generated.languagePlugin.typescript.getServiceScript(
			sourceScript.generated.root,
		);
	if (serviceScript == null) {
		throw new Error("Expected serviceScript to exist");
	}

	const serviceText = serviceScript.code.snapshot.getText(
		0,
		serviceScript.code.snapshot.getLength(),
	);

	const virtualCode = sourceScript.generated.root as VueVirtualCode;
	const codegen = tsCodegen.get(virtualCode.sfc);
	if (codegen == null) {
		throw new Error("Expected codegen to exist");
	}

	const map = volarLanguage.maps.get(serviceScript.code, sourceScript);

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
		// Should we parse expressions?
		// prefixIdentifiers: true,
	});

	// TODO: directives
	// TODO: support defineComponent

	// const directivesCollector = new DirectivesCollector()

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
		directives.push(mapRange(d));
	}

	function mapRange<T extends { range: NormalizedReportRangeObject }>(
		obj: T,
	): T {
		const sourceRange = map
			.toSourceRange(obj.range.begin.raw, obj.range.end.raw, true)
			.next();
		if (sourceRange.done) {
			return obj;
		}
		const [sourceStart, sourceEnd] = sourceRange.value;
		return {
			...obj,
			range: normalizeRange(
				{ begin: sourceStart, end: sourceEnd },
				{
					text: sourceText,
				},
			),
		};
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
							code += e.code.toString();
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
				const translatedReports: NormalizedReport[] = [];
				const reports = await runTypeScriptBasedLanguageRule(
					program,
					sourceFile,
					rule,
					options,
					{
						vueServices: {
							codegen,
							map,
							reportSfc: (report: RuleReport) => {
								// TODO: avoid bringing entire dependency for such trivial task?
								const positionBegin = fileLocation.toPoint(report.range.begin);
								if (positionBegin == null) {
									throw new Error("Invalid report.range.begin");
								}
								const positionEnd = fileLocation.toPoint(report.range.end);
								if (positionEnd == null) {
									throw new Error("Invalid report.range.begin");
								}
								translatedReports.push({
									...report,
									fix:
										report.fix && !Array.isArray(report.fix)
											? [report.fix]
											: report.fix,
									message: rule.messages[report.message],
									range: {
										begin: {
											column: positionBegin.column - 1,
											line: positionBegin.line - 1,
											raw: report.range.begin,
										},
										end: {
											column: positionEnd.column - 1,
											line: positionEnd.line - 1,
											raw: report.range.end,
										},
									},
								});
							},
							sfc: sfcAst,
							virtualCode,
						},
					} satisfies Omit<VueServices, keyof TypeScriptServices>,
				);

				for (const report of reports) {
					const reportRange = translateRange(
						serviceText,
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
							text: sourceText,
						}),
					};
					if (report.suggestions != null) {
						translatedReport.suggestions = report.suggestions.map<Suggestion>(
							(suggestion) => {
								if (isSuggestionForFiles(suggestion)) {
									throw new Error(
										"TODO: vue - suggestions for multiple files are not yet supported",
									);
								}
								const range = translateRange(
									serviceText,
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
							},
						);
					}

					translatedReports.push(translatedReport);
				}

				return translatedReports;
			},
		},
	};
}
