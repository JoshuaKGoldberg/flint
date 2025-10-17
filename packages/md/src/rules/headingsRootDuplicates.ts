import type { Heading, Html, Node, Root } from "mdast";

import type { WithPosition } from "../nodes.js";

import { markdownLanguage } from "../language.js";

export default markdownLanguage.createRule({
	about: {
		description: "Reports multiple H1 headings in the same document.",
		id: "headingsRootDuplicates",
		preset: "logical",
	},
	messages: {
		multipleH1: {
			primary: "This document has multiple H1 headings.",
			secondary: [
				"An H1 heading defines the main heading of a page and provides important structural information.",
				"Using more than one H1 heading can cause confusion for screen readers and break content hierarchy.",
				"Best practice is to use a single H1 heading per document for clarity and accessibility.",
			],
			suggestions: [
				"Use H2 (##) or lower for subsequent headings",
				"Consider if this content should be split into multiple documents",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				root(node: WithPosition<Root>) {
					const h1Headings: {
						begin: number;
						end: number;
					}[] = [];

					function visit(n: Node): void {
						if (n.type === "heading") {
							const heading = n as Heading;
							// Check for H1 headings (depth 1)
							if (
								heading.depth === 1 &&
								heading.position?.start.offset !== undefined &&
								heading.position.end.offset !== undefined
							) {
								h1Headings.push({
									begin: heading.position.start.offset,
									end: heading.position.end.offset,
								});
							}
						} else if (n.type === "html") {
							const html = n as Html;
							// Check for HTML <h1> tags
							const h1Pattern = /<h1[\s>]/i;
							if (
								h1Pattern.test(html.value) &&
								html.position?.start.offset !== undefined &&
								html.position.end.offset !== undefined
							) {
								h1Headings.push({
									begin: html.position.start.offset,
									end: html.position.end.offset,
								});
							}
						}

						if ("children" in n && Array.isArray(n.children)) {
							for (const child of n.children as Node[]) {
								visit(child);
							}
						}
					}

					visit(node);

					// Report all H1 headings if there are more than one
					if (h1Headings.length > 1) {
						for (const heading of h1Headings) {
							context.report({
								message: "multipleH1",
								range: {
									begin: heading.begin,
									end: heading.end,
								},
							});
						}
					}
				},
			},
		};
	},
});
