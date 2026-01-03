import type {
	LanguageFileCacheImpacts,
	LanguageFileDefinition,
	NormalizedReport,
	RuleReport,
} from "@flint.fyi/core";
import * as ts from "typescript";

import { collectReferencedFilePaths } from "./collectReferencedFilePaths.ts";
import { convertTypeScriptDiagnosticToLanguageFileDiagnostic } from "./convertTypeScriptDiagnosticToLanguageFileDiagnostic.ts";
import { getFirstEnumValues } from "./getFirstEnumValues.ts";
import { normalizeRange } from "./normalizeRange.ts";

export const NodeSyntaxKinds = getFirstEnumValues(ts.SyntaxKind);

export function collectTypeScriptFileCacheImpacts(
	program: ts.Program,
	sourceFile: ts.SourceFile,
): LanguageFileCacheImpacts {
	return {
		dependencies: [
			// TODO: Add support for multi-TSConfig workspaces.
			// https://github.com/flint-fyi/flint/issues/64 & more.
			"tsconfig.json",

			...collectReferencedFilePaths(program, sourceFile),
		],
	};
}

export function createTypeScriptFileFromProgram(
	program: ts.Program,
	sourceFile: ts.SourceFile,
): LanguageFileDefinition {
	return {
		cache: collectTypeScriptFileCacheImpacts(program, sourceFile),
		getDiagnostics() {
			return ts
				.getPreEmitDiagnostics(program, sourceFile)
				.map(convertTypeScriptDiagnosticToLanguageFileDiagnostic);
		},
		async runRule(rule, options) {
			const reports: NormalizedReport[] = [];

			const context = {
				program,
				report: (report: RuleReport) => {
					reports.push({
						...report,
						fix:
							report.fix && !Array.isArray(report.fix)
								? [report.fix]
								: report.fix,
						message: rule.messages[report.message],
						range: normalizeRange(report.range, sourceFile),
					});
				},
				sourceFile,
				typeChecker: program.getTypeChecker(),
			};

			const runtime = await rule.setup(context, options);

			if (runtime?.visitors) {
				const typeChecker = program.getTypeChecker();
				const fileServices = { options, program, sourceFile, typeChecker };
				const { visitors } = runtime;

				const visit = (node: ts.Node) => {
					visitors[NodeSyntaxKinds[node.kind]]?.(node, fileServices);

					node.forEachChild(visit);
				};

				visit(sourceFile);
			}

			await runtime?.teardown?.();

			return reports;
		},
	};
}
