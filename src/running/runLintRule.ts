import * as ts from "typescript";

import { normalizeRange } from "../testing/normalizeRange.js";
import { NormalizedRuleReport, RuleReport } from "../types/reports.js";
import { AnyRuleDefinition } from "../types/rules.js";
import { AnyOptionalSchema, InferredObject } from "../types/shapes.js";

export function runLintRule<
	OptionsSchema extends AnyOptionalSchema | undefined,
>(
	rule: AnyRuleDefinition<OptionsSchema>,
	options: InferredObject<OptionsSchema>,
	sourceFile: ts.SourceFile,
	typeChecker: ts.TypeChecker,
) {
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
