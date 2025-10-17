import type { Node, Root, Text } from "mdast";

import type { WithPosition } from "../nodes.js";

import { markdownLanguage } from "../language.js";

export default markdownLanguage.createRule({
	about: {
		description: "Reports reversed link and image syntax in Markdown.",
		id: "mediaSyntaxReversals",
		preset: "logical",
	},
	messages: {
		reversedImage: {
			primary: "This image syntax is reversed.",
			secondary: [
				"Image syntax requires exclamation mark, square brackets, then parentheses: ![alt](url).",
				"The syntax !(text)[url] is invalid and won't render correctly.",
				"Place the alt text in square brackets and the URL in parentheses.",
			],
			suggestions: [
				"Change to correct syntax: ![alt](url)",
				"Ensure square brackets come before parentheses",
			],
		},
		reversedLink: {
			primary: "This link syntax is reversed.",
			secondary: [
				"Link syntax requires square brackets followed by parentheses: [text](url).",
				"The syntax (text)[url] is invalid and won't render correctly.",
				"Place the link text in square brackets and the URL in parentheses.",
			],
			suggestions: [
				"Change to correct syntax: [text](url)",
				"Ensure square brackets come before parentheses",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				root(node: WithPosition<Root>) {
					function visit(n: Node): void {
						if (n.type === "text") {
							const textNode = n as Text;
							const text = textNode.value;

							// Pattern for reversed image: !(text)[url]
							const reversedImagePattern = /!\([^)]+\)\[[^\]]+\]/g;
							// Pattern for reversed link: (text)[url]
							const reversedLinkPattern = /(?<!!)\([^)]+\)\[[^\]]+\]/g;

							let match: null | RegExpExecArray;

							// Check for reversed images
							while ((match = reversedImagePattern.exec(text)) !== null) {
								if (textNode.position?.start.offset !== undefined) {
									const matchStart =
										textNode.position.start.offset + match.index;
									const matchEnd = matchStart + match[0].length;

									context.report({
										message: "reversedImage",
										range: {
											begin: matchStart,
											end: matchEnd,
										},
									});
								}
							}

							// Check for reversed links
							while ((match = reversedLinkPattern.exec(text)) !== null) {
								if (textNode.position?.start.offset !== undefined) {
									const matchStart =
										textNode.position.start.offset + match.index;
									const matchEnd = matchStart + match[0].length;

									context.report({
										message: "reversedLink",
										range: {
											begin: matchStart,
											end: matchEnd,
										},
									});
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
