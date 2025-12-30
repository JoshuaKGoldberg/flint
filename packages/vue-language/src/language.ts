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
		prepareFile(filePathAbsolute, { program, sourceFile }, sourceScript) {
			// @ts-expect-error
			const volarLanguage: VolarLanguage = program.__flintVolarLanguage;

			if (volarLanguage == null) {
				throw new Error(
					"'typescript' package wasn't properly patched. Make sure you don't import 'typescript' before Flint.",
				);
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
				extraContext: (reportTranslated) => ({
					vueServices: {
						codegen,
						map,
						reportSfc: reportTranslated,
						sfc: sfcAst,
						virtualCode,
					},
				}),
			};
		},
	};
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
): LanguagePreparedDefinition;
