#!/usr/bin/env node
import { enableCompileCache, registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

enableCompileCache();

const typescriptUrl = import.meta.resolve("typescript");

registerHooks({
	load(url, context, nextLoad) {
		const next = nextLoad(url, context);

		if (next.source == null) {
			return next;
		}

		if (url === typescriptUrl) {
			return {
				...next,
				source: transformTscContent(next.source.toString()),
			};
		}

		return next;
	},
});

const coreCreateProxyProgramPath = fileURLToPath(
	import.meta.resolve("@flint.fyi/core/lib/ts-patch/proxy-program.js"),
);

// https://github.com/volarjs/volar.js/blob/e08f2f449641e1c59686d3454d931a3c29ddd99c/packages/typescript/lib/quickstart/runTsc.ts
function transformTscContent(source: string): string {
	source += `
function _flintDynamicProxy(getter) {
	return new Proxy(function () {}, new Proxy({}, {
		get(_, property) {
			return (_, ...args) => Reflect[property](getter(), ...args)
		}
	}))
}

const _flintTsPatch = require(${JSON.stringify(coreCreateProxyProgramPath)})
	`;
	injectExtraSupportedExtensions("supportedTSExtensions");
	injectExtraSupportedExtensions("supportedJSExtensions");
	injectExtraSupportedExtensions("allSupportedExtensions");

	injectDynamicProxy("supportedTSExtensionsFlat");
	injectDynamicProxy("supportedTSExtensionsWithJson");
	injectDynamicProxy("supportedJSExtensionsFlat");
	injectDynamicProxy("allSupportedExtensionsWithJson");

	source = replaceOrThrow(
		source,
		"function changeExtension(path, newExtension)",
		(s) => `${s} {
return _flintTsPatch.getExtraSupportedExtensions().some(ext => path.endsWith(ext))
	? path + newExtension
	: _changeExtension(path, newExtension)
}

function _changeExtension(path, newExtension)`,
	);

	source = replaceOrThrow(
		source,
		/function createProgram\(/,
		(match, args: string) => `function createProgram(...args) {
	return _flintTsPatch.proxyCreateProgram(
		new Proxy({}, { get(_target, p, _receiver) { return eval(p); } } ),
		_createProgram,
	)(...args)
}

console.log('TODO: typescript patched')

function _createProgram(`,
	);

	return source;

	function injectExtraSupportedExtensions(variable: string) {
		injectDynamicProxy(
			variable,
			(initializer) =>
				`${initializer}.map((group, i) => (i === 0 && group.push(..._flintTsPatch.getExtraSupportedExtensions()), group))`,
		);
	}

	function injectDynamicProxy(
		variable: string,
		transformInitializer?: (initializer: string) => string,
	) {
		source = replaceOrThrow(
			source,
			new RegExp(`(${variable}) = (.*)(?=;)`),
			(match, decl: string, initializer: string) =>
				`${decl} = _flintDynamicProxy(() => ${transformInitializer?.(initializer) ?? initializer})`,
		);
	}
}

function replaceOrThrow(
	source: string,
	search: RegExp | string,
	replace: (substring: string, ...args: any[]) => string,
): string {
	const before = source;
	source = source.replace(search, replace);
	const after = source;
	if (after === before) {
		throw new Error("Flint bug: failed to replace: " + search.toString());
	}
	return after;
}

const { runCli } = await import("@flint.fyi/cli");
process.exitCode = await runCli(process.argv.slice(2));
