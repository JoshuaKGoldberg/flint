import type { ReportInterpolationData } from "@flint.fyi/core";
import chalk from "chalk";

import { ColorCodes } from "./constants.ts";

export function formatSuggestion(
	data: ReportInterpolationData | undefined,
	suggestion: string,
) {
	if (data) {
		suggestion = suggestion.replaceAll(
			/\{\{\s*(\w+)\s*\}\}/g,
			(match, key: string) => {
				if (key in data) {
					return String(data[key]);
				}

				return match;
			},
		);
	}

	return [
		chalk.hex(ColorCodes.defaultSuggestionColor)(
			suggestion
				.split("`")
				.map((text, index) =>
					chalk.hex(
						index % 2 === 0
							? ColorCodes.defaultSuggestionColor
							: ColorCodes.suggestionTextHighlight,
					)(text),
				)
				.join("`"),
		),
	].join("");
}
