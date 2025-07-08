import * as fs from "node:fs";

import { Presenter } from "../../types/presenters.js";
import { FileRuleReport } from "../../types/reports.js";

export async function printFile(
	filePath: string,
	presenter: Presenter,
	reports: FileRuleReport[],
) {
	return (
		await Array.fromAsync(
			presenter.renderFile({
				file: {
					filePath,
					text: fs.readFileSync(filePath, "utf-8"),
				},
				reports,
			}),
		)
	)
		.join("")
		.trim();
}
