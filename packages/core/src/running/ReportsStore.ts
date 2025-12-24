import { LanguageFile } from "../types/languages.js";
import { FileResults } from "../types/linting.js";
import { RuleReport } from "../types/reports.js";
import { AnyRule, Rule } from "../types/rules.js";

export class ReportsStore {
	#filesResults = new Map<string, FileResults>();
	#totalResults = 0;

	receive(
		currentFile: LanguageFile,
		currentFilePath: string,
		report: RuleReport,
		rule: AnyRule,
	) {
		const normalized = {
			...report,
			fix: report.fix && !Array.isArray(report.fix) ? [report.fix] : report.fix,
			message: rule.messages[report.message],
			range: currentFile.normalizeRange(report.range),
		};

		this.#totalResults;
	}
}
