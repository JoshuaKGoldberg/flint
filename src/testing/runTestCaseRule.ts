import * as ts from "typescript";

import { RuleConfiguration } from "../types/configurations.js";
import { ReportRangeObject, RuleReport } from "../types/reports.js";
import { AnyOptionalSchema } from "../types/shapes.js";
import { createProgramSourceFile } from "./createProgramSourceFile.js";
import { normalizeRange } from "./normalizeRange.js";

export interface NormalizedRuleReport<Message extends string = string> {
	message: Message;
	range: ReportRangeObject;
}

export interface NormalizedTestCase {
	code: string;
	fileName?: string;
}

export function runTestCaseRule<
	OptionsSchema extends AnyOptionalSchema | undefined,
>(
	{ options, rule }: Required<RuleConfiguration<OptionsSchema>>,
	{ code, fileName = "file.ts" }: NormalizedTestCase,
) {
	const { sourceFile, typeChecker } = createProgramSourceFile(fileName, code);

	const reports: NormalizedRuleReport[] = [];

	const context = {
		report(report: RuleReport) {
			reports.push({
				message: rule.messages[report.message],
				range: normalizeRange(report.range),
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
}
