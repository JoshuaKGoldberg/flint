import chalk from "chalk";

import { colorCodes } from "./constants.js";

export function formatSuggestion(suggestion: string) {
	return [
		chalk.hex(colorCodes.defaultSuggestionColor)(
			suggestion
				.split("`")
				.map((text, index) =>
					chalk.hex(
						index % 2 === 0
							? colorCodes.defaultSuggestionColor
							: colorCodes.suggestionTextHighlight,
					)(text),
				)
				.join("`"),
		),
	].join("");
}
