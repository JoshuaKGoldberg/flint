import chalk from "chalk";

import { ColorCodes } from "./constants.ts";

export function formatSuggestion(suggestion: string) {
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
