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

			reportsByFilePath.get(filePath).push({
				...ruleReport,
				about: rule.about,
				fix:
					ruleReport.fix && !Array.isArray(ruleReport.fix)
						? [ruleReport.fix]
						: ruleReport.fix,
				message: rule.messages[ruleReport.message],
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

	if (ruleRuntime) {
		for (const { languageFiles, options } of filesAndOptions) {
			for (const file of languageFiles) {
				currentFile = file;

				// TODO: How to make types more permissive around assignability?
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				file.runVisitors(options as object | undefined, ruleRuntime);
			}
		}

		await ruleRuntime.teardown?.();
	}

	const reports = new Map(reportsByFilePath.entries());

	log("Found %d total reports for rule %s", reports.size, rule.about.id);

	return reports;
}
