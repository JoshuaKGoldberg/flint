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
				root(root: WithPosition<Root>) {
					const headingTexts = new Map<
						string,
						{
							begin: number;
							end: number;
						}[]
					>();

					function collectText(node: Node): string {
						if (node.type === "text") {
							return (node as Text).value;
						}
						if ("children" in node && Array.isArray(node.children)) {
							return (node.children as Node[]).map(collectText).join("");
						}
						return "";
					}

					function visitHeading(node: WithPosition<Heading>) {
						const headingText = collectText(node).trim().toLowerCase();

						const existing = headingTexts.get(headingText);
						if (existing) {
							existing.push({
								begin: node.position.start.offset,
								end: node.position.end.offset,
							});
						} else {
							headingTexts.set(headingText, [
								{
									begin: node.position.start.offset,
									end: node.position.end.offset,
								},
							]);
						}
					}

					function visit(node: Node) {
						if (node.type === "heading") {
							visitHeading(node as WithPosition<Heading>);
						}

						if ("children" in node && Array.isArray(node.children)) {
							for (const child of node.children as Node[]) {
								visit(child);
							}
						}
					}

					// TODO: Add :exit selectors, so this rule can report after traversal?
					visit(root);

					for (const [text, occurrences] of headingTexts) {
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
