import {
	getColumnAndLineOfPosition,
	LanguageFileDefinition,
} from "@flint.fyi/core";
import { visit } from "unist-util-visit";
import * as yamlParser from "yaml-unist-parser";

// Eventually, it might make sense to use a native speed Yaml parser...
// However, the unist ecosystem is quite extensive and well-supported.
// It'll be a while before we can replace it with a native parser.
export function createYamlFile(sourceText: string) {
	const root = yamlParser.parse(sourceText);
	const sourceFileText = { text: sourceText };

	const languageFile: LanguageFileDefinition = {
		normalizeRange: (range) => ({
			begin: getColumnAndLineOfPosition(sourceFileText, range.begin),
			end: getColumnAndLineOfPosition(sourceFileText, range.end),
		}),
		runRule(runtime, options) {
			if (runtime.visitors) {
				const fileServices = { options, root };
				const { visitors } = runtime;

				visit(root, (node) => {
					visitors[node.type]?.(node, fileServices);
				});
			}
		},
	};

	return { languageFile, root };
}
