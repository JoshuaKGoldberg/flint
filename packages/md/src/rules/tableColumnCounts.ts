import { markdownLanguage } from "../language.js";

export default markdownLanguage.createRule({
	about: {
		description:
			"Reports table rows with column counts that don't match the header.",
		id: "tableColumnCounts",
		preset: "logical",
	},
	messages: {
		tooManyCells: {
			primary:
				"This table row has {{ actual }} cells but the header has {{ expected }}.",
			secondary: [
				"In GitHub Flavored Markdown tables, data rows should not have more cells than the header row.",
				"Extra cells beyond the header column count can lead to lost data or rendering issues.",
				"Ensure all data rows have at most the same number of cells as the header.",
			],
			suggestions: [
				"Remove extra cells from this row",
				"Add columns to the header if needed",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				table: (node) => {
					if (node.children.length === 0) {
						return;
					}

					const [headerRow, ...dataRows] = node.children;

					for (const dataRow of dataRows) {
						const dataCellCount = dataRow.children.length;

						if (
							dataCellCount <= headerRow.children.length ||
							dataRow.position?.start.offset === undefined ||
							dataRow.position.end.offset === undefined
						) {
							continue;
						}

						context.report({
							data: {
								actual: dataCellCount,
								expected: headerRow.children.length,
							},
							message: "tooManyCells",
							range: {
								begin: dataRow.position.start.offset,
								end: dataRow.position.end.offset,
							},
						});
					}
				},
			},
		};
	},
});
