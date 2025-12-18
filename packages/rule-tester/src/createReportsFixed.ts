import { applyChangesToText, NormalizedReport } from "@flint.fyi/core";

export function createReportsFixed(
	sourceText: string,
	reports: NormalizedReport[],
) {
	let hadFix = false;
	let output = sourceText;

	for (const report of reports) {
		if (!report.fix) {
			continue;
		}

		hadFix = true;
		output = applyChangesToText(report.fix, output);
	}

	return hadFix ? output : undefined;
}
