import { styleText } from "node:util";

import { FileResults } from "../../types/linting.js";
import { pluralize } from "../pluralize.js";

export function* presentDiagnostics(filesResults: Map<string, FileResults>) {
	const diagnostics = Array.from(filesResults.values()).flatMap(
		(fileResults) => fileResults.diagnostics,
	);
	if (!diagnostics.length) {
		return;
	}

	yield "\n";
	yield styleText(
		"yellow",
		`⚠️  Additionally found ${pluralize(diagnostics.length, "diagnostic")} from tsc:`,
	);
	yield "\n\n";

	for (const diagnostic of diagnostics) {
		yield diagnostic.text;
	}

	yield "\n\n";
}
