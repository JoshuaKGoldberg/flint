import {
	AnyOptionalSchema,
	AnyRuleDefinition,
	InferredObject,
	LanguageFileCacheImpacts,
	LanguageFileDefinition,
	LanguageFileDiagnostic,
	NormalizedReport,
	RuleReport,
} from "@flint.fyi/core";
import * as ts from "typescript";

import { collectReferencedFilePaths } from "./collectReferencedFilePaths.js";
import { formatDiagnostic } from "./formatDiagnostic.js";
import { getFirstEnumValues } from "./getFirstEnumValues.js";
import { normalizeRange } from "./normalizeRange.js";

export const NodeSyntaxKinds = getFirstEnumValues(ts.SyntaxKind);

export function collectTypeScriptFileCacheImpacts(
	program: ts.Program,
	sourceFile: ts.SourceFile,
): LanguageFileCacheImpacts {
	return {
		dependencies: [
			// TODO: Add support for multi-TSConfig workspaces.
			// https://github.com/JoshuaKGoldberg/flint/issues/64 & more.
			"tsconfig.json",

			...collectReferencedFilePaths(program, sourceFile),
		],
	};
}

export function convertTypeScriptDiagnosticToLanguageFileDiagnostic(
	diagnostic: ts.Diagnostic,
): LanguageFileDiagnostic {
	return {
		code: `TS${diagnostic.code}`,
		text: formatDiagnostic({
			...diagnostic,
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			length: diagnostic.length!,
			message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
			name: `TS${diagnostic.code}`,
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			start: diagnostic.start!,
		}),
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
			return runTypeScriptBasedLanguageRule(program, sourceFile, rule, options);
		},
	};
}

export async function runTypeScriptBasedLanguageRule<
	OptionsSchema extends AnyOptionalSchema | undefined =
		| AnyOptionalSchema
		| undefined,
>(
	program: ts.Program,
	sourceFile: ts.SourceFile,
	rule: AnyRuleDefinition<OptionsSchema>,
	options: InferredObject<OptionsSchema>,
	extraContext?: Record<string, unknown>,
): Promise<NormalizedReport[]> {
	const reports: NormalizedReport[] = [];

	const context = {
		program,
		report: (report: RuleReport) => {
			reports.push({
				...report,
				fix:
					report.fix && !Array.isArray(report.fix) ? [report.fix] : report.fix,
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

	visit(sourceFile);

	return reports;
}
