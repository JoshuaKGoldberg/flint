import type { Node, Root, Table } from "mdast";

import type { WithPosition } from "../nodes.js";

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
				root(node: WithPosition<Root>) {
					function visit(n: Node): void {
						if (n.type === "table") {
							const table = n as Table;

							// A table should have at least a header row
							if (table.children.length === 0) {
								return;
							}

							// First row is the header
							const headerRow = table.children[0];
							const headerCellCount = headerRow.children.length;

							// Check all subsequent rows (data rows)
							for (let i = 1; i < table.children.length; i++) {
								const dataRow = table.children[i];
								const dataCellCount = dataRow.children.length;

								// Report if data row has MORE cells than header
								if (dataCellCount > headerCellCount) {
									if (
										dataRow.position?.start.offset !== undefined &&
										dataRow.position.end.offset !== undefined
									) {
										context.report({
											data: {
												actual: String(dataCellCount),
												expected: String(headerCellCount),
											},
											message: "tooManyCells",
											range: {
												begin: dataRow.position.start.offset,
												end: dataRow.position.end.offset,
											},
										});
									}
								}
							}
						}

						if ("children" in n && Array.isArray(n.children)) {
							for (const child of n.children as Node[]) {
								visit(child);
							}
						}
					}

					visit(node);
				},
			},
		};
	},
});
