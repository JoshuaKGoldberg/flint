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
				root(root: WithPosition<Root>) {
					function visitTable(table: Table) {
						if (table.children.length === 0) {
							return;
						}

						const headerRow = table.children[0];
						const headerCellCount = headerRow.children.length;

						for (let i = 1; i < table.children.length; i += 1) {
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

					function visit(node: Node) {
						if (node.type === "table") {
							visitTable(node as Table);
						}

						if ("children" in node && Array.isArray(node.children)) {
							for (const child of node.children as Node[]) {
								visit(child);
							}
						}
					}

					visit(root);
				},
			},
		};
	},
});
