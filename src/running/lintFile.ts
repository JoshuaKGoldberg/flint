import { debugForFile } from "debug-for-file";
import * as ts from "typescript";

import { ConfigRuleDefinition } from "../types/configs.js";
import { FileRuleReport } from "../types/reports.js";
import { computeRulesWithOptions } from "./computeRulesWithOptions.js";
import { runLintRule } from "./runLintRule.js";

const log = debugForFile(import.meta.filename);

export function lintFile(
	filePathAbsolute: string,
	ruleDefinitions: ConfigRuleDefinition[],
	service: ts.server.ProjectService,
) {
	log("Linting: %s", filePathAbsolute);
	service.openClientFile(filePathAbsolute);

	// TODO: These should be abstracted into a language concept...
	/* eslint-disable @typescript-eslint/no-non-null-assertion */
	const scriptInfo = service.getScriptInfo(filePathAbsolute)!;
	const program = service
		.getDefaultProjectForFile(scriptInfo.fileName, true)!
		.getLanguageService(true)
		.getProgram()!;
	const sourceFile = program.getSourceFile(filePathAbsolute)!;
	const typeChecker = program.getTypeChecker();
	/* eslint-enable @typescript-eslint/no-non-null-assertion */

	log("Retrieved type source file and type checker.");

	const allReports: FileRuleReport[] = [];
	const rulesWithOptions = computeRulesWithOptions(ruleDefinitions);

	for (const [rule, options] of rulesWithOptions) {
		log("Running rule %s with options: %o", rule.about.id, options);
		const ruleReports = runLintRule(
			rule,
			options as object | undefined,
			sourceFile,
			typeChecker,
		);
		log("Found %d reports from rule %s", ruleReports.length, rule.about.id);

		allReports.push(
			...ruleReports.map((report) => ({ ruleId: rule.about.id, ...report })),
		);
	}

	log("Found %d reports for %s", allReports.length, filePathAbsolute);
	service.closeClientFile(filePathAbsolute);

	return allReports;
}
