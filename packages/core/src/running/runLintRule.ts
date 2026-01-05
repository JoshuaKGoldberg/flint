import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import type { AnyLanguageFileDefinition } from "../types/languages.ts";
import type { FileReport } from "../types/reports.ts";
import type { AnyRule } from "../types/rules.ts";
import { getColumnAndLineOfPosition } from "../utils/getColumnAndLineOfPosition.ts";
import type { LanguageFilesWithOptions } from "./types.ts";

const log = debugForFile(import.meta.filename);

export async function runLintRule(
	rule: AnyRule,
	filesAndOptions: LanguageFilesWithOptions[],
) {
	// 1. Set up the rule's runtime, which receives and processes reports

	const reportsByFilePath = new CachedFactory<string, FileReport[]>(() => []);
	let currentFile: AnyLanguageFileDefinition | undefined;

	const ruleRuntime = await rule.setup({
		report(ruleReport) {
			if (!currentFile) {
				throw new Error(
					"`filePath` not provided in a rule report() not called by a visitor.",
				);
			}

			const filePath = ruleReport.filePath ?? currentFile.about.filePath;

			log("Adding %s report for file path %s", ruleReport.message, filePath);

			const messageData = rule.messages[ruleReport.message];
			if (!messageData) {
				throw new Error(
					`Rule "${rule.about.id}" reported message "${ruleReport.message}" which is not defined in its messages.`,
				);
			}

			reportsByFilePath.get(filePath).push({
				...ruleReport,
				about: rule.about,
				fix:
					ruleReport.fix && !Array.isArray(ruleReport.fix)
						? [ruleReport.fix]
						: ruleReport.fix,
				message: messageData,
				range: {
					begin: getColumnAndLineOfPosition(
						currentFile.about.sourceText,
						ruleReport.range.begin,
					),
					end: getColumnAndLineOfPosition(
						currentFile.about.sourceText,
						ruleReport.range.end,
					),
				},
			});
		},
	});

	// 2. If the rule requested a runtime presence, ...

	if (ruleRuntime) {
		// 2a. If the rule has visitors, run them on every file to lint, with options
		if (ruleRuntime.visitors) {
			for (const { languageFiles, options } of filesAndOptions) {
				for (const file of languageFiles) {
					currentFile = file;

					// TODO: How to make types more permissive around assignability?
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					file.runVisitors(options as object | undefined, ruleRuntime);
				}
			}
		}

		// 2b. If the rule has a teardown, run that after any visitors are done
		await ruleRuntime.teardown?.();
	}

	const reports = new Map(reportsByFilePath.entries());

	log("Found %d total reports for rule %s", reports.size, rule.about.id);

	return reports;
}
