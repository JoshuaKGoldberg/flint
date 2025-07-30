import { styleText } from "node:util";

import { pluralize } from "../pluralize.js";
import { PresenterSummarizeContext } from "../types.js";

export interface SummaryCounts {
	all: number;
	files: number;
	fixable: number;
}

export function* presentSummary(
	counts: SummaryCounts,
	{ formattingResults, runConfigResults }: PresenterSummarizeContext,
) {
	if (runConfigResults.changed?.size) {
		yield styleText(
			"green",
			[
				"✔ Fixed ",
				styleText("bold", pluralize(runConfigResults.changed.size, "file")),
				" automatically (--fix).\n\n",
			].join(""),
		);
	}

	if (counts.all === 0) {
		yield styleText("green", "No linting issues found.\n");
	} else {
		yield "\n";
		yield styleText(
			"red",
			[
				"\u2716 Found ",
				styleText("bold", pluralize(counts.all, "report")),
				" across ",
				styleText("bold", pluralize(counts.files, "file")),
				...(counts.fixable
					? [
							" (",
							styleText(
								"bold",
								pluralize(counts.fixable, "fixable with --fix"),
							),
							")",
						]
					: []),
				".\n",
			].join(""),
		);
	}

	if (formattingResults.dirty.size) {
		yield "\n";

		if (formattingResults.written) {
			yield styleText(
				"blue",
				[
					"✳ Cleaned ",
					styleText("bold", pluralize(formattingResults.dirty.size, "file")),
					"'s formatting with Prettier (--fix):\n",
				].join(""),
			);
		} else {
			yield styleText(
				"blue",
				[
					"✳ Found ",
					styleText("bold", pluralize(formattingResults.dirty.size, "file")),
					" with Prettier formatting differences (add ",
					styleText("bold", "--fix"),
					" to rewrite):\n",
				].join(""),
			);
		}

		for (const dirtyFile of formattingResults.dirty) {
			yield `  ${styleText("gray", dirtyFile)}\n`;
		}
	}
}
