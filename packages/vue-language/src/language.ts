import assert from "node:assert/strict";
import { RuleReporter } from "@flint.fyi/core";
import { setTSExtraSupportedExtensions } from "@flint.fyi/ts-patch";
import { createVolarBasedLanguage } from "@flint.fyi/volar-language";
import { Mapper as VolarMapper } from "@volar/language-core";
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
	VueVirtualCode,
} from "@vue/language-core";
import {
	collectTypeScriptFileCacheImpacts,
	ExtractedDirective,
} from "@flint.fyi/ts";

setTSExtraSupportedExtensions([".vue"]);

export interface VueServices {
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

export const vueLanguage = createVolarBasedLanguage<VueServices>(
	(ts, options) => {
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
				const virtualCode = sourceScript.generated.root as VueVirtualCode;
				const codegen = tsCodegen.get(virtualCode.sfc);
				assert.ok(
					codegen != null,
					`Flint bug: tsCodegen for ${filePathAbsolute} is undefined`,
				);

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
				const directives: ExtractedDirective[] = [];
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

				return {
					directives,
					firstStatementPosition:
						sfcAst.children.find((c) => c.type !== NodeTypes.COMMENT)?.loc.start
							.offset ?? sourceText.length,
					cache: collectTypeScriptFileCacheImpacts(program, sourceFile),
					getDiagnostics() {
						return (virtualCode.vueSfc?.errors ?? []).map((e) => {
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
						});
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
	},
);

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
