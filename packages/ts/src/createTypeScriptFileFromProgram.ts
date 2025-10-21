import {
	LanguageFileDefinition,
	NormalizedReport,
	RuleReport,
} from "@flint.fyi/core";
import * as ts from "typescript";

import { collectReferencedFilePaths } from "./collectReferencedFilePaths.js";
import { formatDiagnostic } from "./formatDiagnostic.js";
import { getFirstEnumValues } from "./getFirstEnumValues.js";
import { normalizeRange } from "./normalizeRange.js";

const NodeSyntaxKinds = getFirstEnumValues(ts.SyntaxKind);

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
		async runRule(rule, options) {
			const reports: NormalizedReport[] = [];

			const context = {
				program,
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

			const runtime = await rule.setup(context, options);

			if (!runtime?.visitors) {
				return reports;
			}

			const { visitors } = runtime;
			const visit = (node: ts.Node) => {
				visitors[NodeSyntaxKinds[node.kind]]?.(node);

				node.forEachChild(visit);
			};

			sourceFile.forEachChild(visit);

			return reports;
		},
	};
}
