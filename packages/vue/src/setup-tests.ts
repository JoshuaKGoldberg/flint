import { AsyncLocalStorage } from "node:async_hooks";
import { registerHooks } from "node:module";

import {
	transformTscContent,
	transformVueCompilerCore,
	VolarLanguagePluginsGetter,
} from "./patch-typescript.js";
import { ParserOptions, RootNode } from "@vue/compiler-core";

export const vueLanguageParseContext = new AsyncLocalStorage<{
	getLanguagePlugins: VolarLanguagePluginsGetter;
	setVueAst: (ast: RootNode, options: ParserOptions) => void;
}>();

(global as any)._vueLanguageParseContext = vueLanguageParseContext;

const typescriptUrl = import.meta.resolve("typescript");
const vueCompilerCoreBaseUrl = import.meta.resolve("@vue/compiler-core");
const vueCompilerCoreUrls = [
	"compiler-core.cjs.js",
	"compiler-core.cjs.prod.js",
	"compiler-core.esm-bundler.js",
].map(
	(file) =>
		new URL(
			vueCompilerCoreBaseUrl.endsWith("index.js") ? `dist/${file}` : file,
			vueCompilerCoreBaseUrl,
		).href,
);

registerHooks({
	load(url, context, nextLoad) {
		const next = nextLoad(url, context);

		if (next.source == null) {
			return next;
		}

		if (url === typescriptUrl) {
			return {
				...next,
				source: transformTscContent(next.source.toString(), [".vue"]),
			};
		} else if (vueCompilerCoreUrls.includes(url)) {
			return {
				...next,
				source: transformVueCompilerCore(next.source.toString()),
			};
		}

		return next;
	},
});
