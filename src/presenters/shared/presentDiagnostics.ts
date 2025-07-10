import { styleText } from "node:util";

import { LanguageFileDiagnostic } from "../../types/languages.js";
import { pluralize } from "../pluralize.js";

export function* presentDiagnostics(diagnostics: LanguageFileDiagnostic[]) {
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
