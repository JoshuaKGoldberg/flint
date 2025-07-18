import {
	LanguageFileDefinition,
	NormalizedRuleReport,
	RuleReport,
} from "@flint.fyi/core";
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
		async runRule(rule, options) {
			const reports: NormalizedRuleReport[] = [];

			const context = {
				report: (report: RuleReport) => {
					reports.push({
						...report,
						message: rule.messages[report.message],
						range: normalizeRange(report.range, sourceFile),
					});
				},
				sourceFile,
			};

			const visitors = await rule.setup(context, options);

			if (!visitors) {
				return reports;
			}

			const visit = (node: ts.Node) => {
				visitors[ts.SyntaxKind[node.kind]]?.(node);

				node.forEachChild(visit);
			};

			sourceFile.forEachChild(visit);

			return reports;
		},
	};
}
