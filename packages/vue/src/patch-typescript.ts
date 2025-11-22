import type { Language, LanguagePlugin } from "@volar/language-core";
import type * as ts from "typescript";

export type VolarLanguagePluginsGetter = (
	ts: typeof import("typescript"),
	options: ts.CreateProgramOptions,
) =>
	| LanguagePlugin<string>[]
	| {
			languagePlugins: LanguagePlugin<string>[];
			setup?(language: Language<string>): void;
	  };

const volarProxyCreateProgramPath = require.resolve(
	"@volar/typescript/lib/node/proxyCreateProgram",
);

// https://github.com/volarjs/volar.js/blob/e08f2f449641e1c59686d3454d931a3c29ddd99c/packages/typescript/lib/quickstart/runTsc.ts
export function transformTscContent(
	tsc: string,
	extraSupportedExtensions: string[],
) {
	// Add allow extensions
	if (extraSupportedExtensions.length) {
		const extsText = extraSupportedExtensions
			.map((ext) => `"${ext}"`)
			.join(", ");
		tsc = replace(
			tsc,
			/supportedTSExtensions = .*(?=;)/,
			(s) =>
				s +
				`.map((group, i) => i === 0 ? group.splice(0, 0, ${extsText}) && group : group)`,
		);
		tsc = replace(
			tsc,
			/supportedJSExtensions = .*(?=;)/,
			(s) =>
				s +
				`.map((group, i) => i === 0 ? group.splice(0, 0, ${extsText}) && group : group)`,
		);
		tsc = replace(
			tsc,
			/allSupportedExtensions = .*(?=;)/,
			(s) =>
				s +
				`.map((group, i) => i === 0 ? group.splice(0, 0, ${extsText}) && group : group)`,
		);

		// Support for basename.xxx to basename.xxx.d.ts
		tsc = replace(
			tsc,
			/function changeExtension\(/,
			(s) =>
				`function changeExtension(path, newExtension) {
			return [${extsText}].some(ext => path.endsWith(ext))
				? path + newExtension
				: _changeExtension(path, newExtension)
			}\n` + s.replace("changeExtension", "_changeExtension"),
		);
	}

	// proxy createProgram
	tsc = replace(
		tsc,
		/function createProgram\(.+\) \{/,
		(s) =>
			// proxyCreateProgram caches volar language setup,
			// but we want it to create language on each call
			`var createProgram = (...args) => require(${JSON.stringify(volarProxyCreateProgramPath)}).proxyCreateProgram(` +
			[
				"new Proxy({}, { get(_target, p, _receiver) { return eval(p); } } )",
				"_createProgram",
				"globalThis._flintVueLanguageParseContext.getStore().getLanguagePlugins",
			].join(", ") +
			")(...args);\n" +
			s.replace("createProgram", "_createProgram"),
	);

	return tsc;
}

export function transformVueCompilerCore(content: string): string {
	return replace(
		content,
		"function baseParse(input, options) {",
		(s) => `
${s}
	const ast = _baseParse(input, options)
	globalThis._flintVueLanguageParseContext.getStore().setVueAst(ast, options)
	return ast
}

function _baseParse(input, options) {`,
	);
}

function replace(
	text: string,
	search: RegExp | string,
	replace: (substring: string) => string,
) {
	const before = text;
	text = text.replace(search, replace);
	const after = text;
	if (after === before) {
		throw new Error("Failed to replace: " + search);
	}
	return after;
}
