import chalk from "chalk";

export function formatSuggestion(suggestion: string) {
	return [
		chalk.hex("#bbccdd")(
			suggestion
				.split("`")
				.map((text, index) =>
					chalk.hex(index % 2 === 0 ? "#bbccdd" : "#bbeeff")(text),
				)
				.join("`"),
		),
		"\n",
	].join("");
}
