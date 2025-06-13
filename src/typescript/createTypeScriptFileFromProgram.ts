import * as ts from "typescript";

import { LanguageFileDefinition } from "../types/languages.js";
import { NormalizedRuleReport, RuleReport } from "../types/reports.js";
import { normalizeRange } from "./normalizeRange.js";

export function createTypeScriptFileFromProgram(
	sourceFile: ts.SourceFile,
	typeChecker: ts.TypeChecker,
): LanguageFileDefinition {
	return {
		runRule(rule, options) {
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
				typeChecker,
			};

			const visitors = rule.setup(context, options);

			if (!visitors) {
				return reports;
			}

			function visit(node: ts.Node) {
				// @ts-expect-error - TODO: Figure this out later...
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				visitors[ts.SyntaxKind[node.kind]]?.(node);

				node.forEachChild(visit);
			}

			sourceFile.forEachChild(visit);

			return reports;
		},
	};
}
