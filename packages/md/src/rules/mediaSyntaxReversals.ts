import type { Text } from "mdast";

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
			primary: "This image syntax is reversed and will not render as an image.",
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
			primary: "This link syntax is reversed and will not render as an image.",
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
				text(node: WithPosition<Text>) {
					for (const [message, pattern] of [
						["reversedImage", /!\([^)]+\)\[[^\]]+\]/g],
						["reversedLink", /(?<!!)\([^)]+\)\[[^\]]+\]/g],
					] as const) {
						let match: null | RegExpExecArray;

						while ((match = pattern.exec(node.value)) !== null) {
							const begin = node.position.start.offset + match.index;
							const end = begin + match[0].length;

							context.report({
								message,
								range: { begin, end },
							});
						}
					}
				},
			},
		};
	},
});
