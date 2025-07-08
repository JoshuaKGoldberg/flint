import * as fs from "node:fs/promises";

import { FormattingResults } from "../types/formatting.js";
import { RunConfigResults } from "../types/linting.js";
import { PresenterRuntime } from "../types/presenters.js";

export async function renderReports(
	presenter: PresenterRuntime,
	configResults: RunConfigResults,
	formattingResults: FormattingResults,
) {
	for (const [filePath, fileResults] of configResults.filesResults) {
		if (!fileResults.reports.length) {
			continue;
		}

		const sourceFileText = await fs.readFile(filePath, "utf-8");

		const body = presenter.renderFile({
			file: {
				filePath,
				text: sourceFileText,
			},
			reports: fileResults.reports,
		});

		for (const line of await Array.fromAsync(body)) {
			process.stdout.write(line);
		}
	}

	const summary = presenter.summarize({
		configResults,
		formattingResults,
	});

	for (const line of await Array.fromAsync(summary)) {
		process.stdout.write(line);
	}
}
