import { LanguageFileDefinition } from "@flint.fyi/core";
import * as ts from "typescript";

import { normalizeRange } from "./normalizeRange.js";

// TODO: Eventually, it might make sense to use a native speed JSON parser.
// The standard TypeScript language will likely use that itself.
// https://github.com/JoshuaKGoldberg/flint/issues/44
export function createTypeScriptJsonFile(
	filePathAbsolute: string,
	sourceText: string,
): LanguageFileDefinition {
	const sourceFile = ts.parseJsonText(filePathAbsolute, sourceText);

	return {
		normalizeRange: (range) => normalizeRange(range, sourceFile),
		runRule(runtime, options) {
			const { visitors } = runtime;
			if (!visitors) {
				return;
			}

			const fileServices = { options, sourceFile };

			const visit = (node: ts.Node) => {
				visitors[ts.SyntaxKind[node.kind]]?.(node, fileServices);
				node.forEachChild(visit);
			};

			sourceFile.forEachChild(visit);
		},
	};
}
