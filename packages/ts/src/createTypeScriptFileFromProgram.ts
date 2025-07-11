import {
	LanguageFileDefinition,
	NormalizedRuleReport,
	RuleReport,
} from "@flint/core";
import * as ts from "typescript";

import { collectReferencedFilePaths } from "./collectReferencedFilePaths.js";
import { formatDiagnostic } from "./formatDiagnostic.js";
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
		getDiagnostics() {
			return ts
				.getPreEmitDiagnostics(program, sourceFile)
				.map((diagnostic) => ({
					code: `TS${diagnostic.code}`,
					text: formatDiagnostic({
						...diagnostic,
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						length: diagnostic.length!,
						message: ts.flattenDiagnosticMessageText(
							diagnostic.messageText,
							"\n",
						),
						name: `TS${diagnostic.code}`,
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						start: diagnostic.start!,
					}),
				}));
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
