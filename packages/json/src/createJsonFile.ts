import {
	LanguageFileDefinition,
	NormalizedReport,
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
		async runRule(runtime, messages) {
			const reports: NormalizedReport[] = [];

			const services = {
				sourceFile,
			};
			const context = {
				...services,
				report: (report: RuleReport) => {
					reports.push({
						...report,
						fix:
							report.fix && !Array.isArray(report.fix)
								? [report.fix]
								: report.fix,
						message: messages[report.message],
						range: normalizeRange(report.range, sourceFile),
					});
				},
				// TODO: can we make this typesafe?
				...(await runtime.fileSetup?.(services)),
			};

			if (!runtime.visitors) {
				return reports;
			}

			const { visitors } = runtime;

			const visit = (node: ts.Node) => {
				visitors[ts.SyntaxKind[node.kind]]?.(node, context);

				node.forEachChild(visit);
			};

			sourceFile.forEachChild(visit);

			return reports;
		},
	};
}
