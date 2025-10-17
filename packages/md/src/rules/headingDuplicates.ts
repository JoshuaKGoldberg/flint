import type { Heading, Node, Root, Text } from "mdast";

import type { WithPosition } from "../nodes.js";

import { markdownLanguage } from "../language.js";

export default markdownLanguage.createRule({
	about: {
		description: "Reports duplicate headings in the same document.",
		id: "headingDuplicates",
		preset: "logical",
	},
	messages: {
		duplicate: {
			primary: "This heading text '{{ text }}' is duplicated in the document.",
			secondary: [
				"Duplicate headings can cause issues with in-document links and table of contents generation.",
				"When generating in-document links, unique headings are necessary to navigate to specific sections.",
				"Generated tables of contents can only link to the first instance of a duplicate heading.",
			],
			suggestions: [
				"Make heading text unique",
				"Consider adding context to differentiate headings",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				root(node: WithPosition<Root>) {
					const headingTextMap = new Map<
						string,
						{
							begin: number;
							end: number;
						}[]
					>();

					// Collect text content from a node tree
					function collectText(n: Node): string {
						if (n.type === "text") {
							return (n as Text).value;
						}
						if ("children" in n && Array.isArray(n.children)) {
							return (n.children as Node[]).map(collectText).join("");
						}
						return "";
					}

					function visit(n: Node): void {
						if (n.type === "heading") {
							const heading = n as Heading;
							const headingText = collectText(heading).trim().toLowerCase();

							if (
								headingText &&
								heading.position?.start.offset !== undefined &&
								heading.position.end.offset !== undefined
							) {
								const existing = headingTextMap.get(headingText);
								if (existing) {
									existing.push({
										begin: heading.position.start.offset,
										end: heading.position.end.offset,
									});
								} else {
									headingTextMap.set(headingText, [
										{
											begin: heading.position.start.offset,
											end: heading.position.end.offset,
										},
									]);
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

					// Report all headings that have duplicates
					for (const [text, occurrences] of headingTextMap) {
						if (occurrences.length > 1) {
							for (const occurrence of occurrences) {
								context.report({
									data: { text },
									message: "duplicate",
									range: {
										begin: occurrence.begin,
										end: occurrence.end,
									},
								});
							}
						}
					}
				},
			},
		};
	},
});
