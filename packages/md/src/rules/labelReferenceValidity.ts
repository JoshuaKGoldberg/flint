import type { Node, Root, Text } from "mdast";

import type { WithPosition } from "../nodes.js";

import { markdownLanguage } from "../language.js";

export default markdownLanguage.createRule({
	about: {
		description: "Reports invalid label references with whitespace.",
		id: "labelReferenceValidity",
		preset: "logical",
	},
	messages: {
		invalidWhitespace: {
			primary: "This label reference has invalid whitespace between brackets.",
			secondary: [
				"CommonMark's shorthand label reference syntax ([label][]) does not allow whitespace between the brackets.",
				"While GitHub may render this correctly, CommonMark-compliant renderers will not treat this as a link reference.",
				"Remove the whitespace between the brackets to make this valid across all Markdown renderers.",
			],
			suggestions: [
				"Remove whitespace between the brackets",
				"Use the full reference syntax: [label][label]",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				root(node: WithPosition<Root>) {
					// Pattern to match shorthand label references with whitespace: [label][ ] or [label][\n]
					const invalidPattern = /\[[^\]]+\]\[\s+\]/g;

					// Traverse the tree to find text nodes
					function visit(n: Node): void {
						if (n.type === "text") {
							const textNode = n as Text;
							if (
								textNode.position?.start.offset === undefined ||
								textNode.position.end.offset === undefined
							) {
								return;
							}

							let match: null | RegExpExecArray;

							while ((match = invalidPattern.exec(textNode.value))) {
								const startOffset =
									textNode.position.start.offset + match.index;
								const endOffset = startOffset + match[0].length;

								context.report({
									message: "invalidWhitespace",
									range: {
										begin: startOffset,
										end: endOffset,
									},
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
				},
			},
		};
	},
});
