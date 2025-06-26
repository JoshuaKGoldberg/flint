import * as ts from "typescript";

import { LanguageFileDefinition } from "../types/languages.js";
import { NormalizedRuleReport, RuleReport } from "../types/reports.js";
import { collectReferencedFilePaths } from "./collectReferencedFilePaths.js";
import { normalizeRange } from "./normalizeRange.js";

export function createTypeScriptFileFromProgram(
	program: ts.Program,
	sourceFile: ts.SourceFile,
): LanguageFileDefinition {
	return {
		cache: {
			dependencies: [
				// TODO: Add support for multi-TSConfig workspaces.
				// https://github.com/JoshuaKGoldberg/flint/issues/64 & more.
				"tsconfig.json",

				...collectReferencedFilePaths(program, sourceFile),
			],
		},
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
				typeChecker: program.getTypeChecker(),
			};

			const visitors = rule.setup(context, options);

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
