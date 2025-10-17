import { Link } from "mdast";

import { markdownLanguage } from "../language.js";
import { WithPosition } from "../nodes.js";

const urlTester = /(?:https?:\/\/|mailto:)\S+|[\w.+-]+@[\w.-]+\.\w+/gi;

export default markdownLanguage.createRule({
	about: {
		description:
			"Reports bare URLs that should be formatted as autolinks or links.",
		id: "bareUrls",
		preset: "stylistic",
	},
	messages: {
		bareUrl: {
			primary: "This bare URL is ambiguous to parsers.",
			secondary: [
				"Bare URLs without angle brackets are not universally recognized as clickable links across all Markdown processors.",
				"While GitHub Flavored Markdown supports bare URLs, standard Markdown requires them to be wrapped in angle brackets (<>) or formatted as links with descriptive text.",
			],
			suggestions: [
				"Wrap the URL in angle brackets: <URL>",
				"Format as a link with descriptive text: [description](URL)",
			],
		},
	},
	setup(context) {
		function report(begin: number, end: number, urlText: string) {
			context.report({
				message: "bareUrl",
				range: { begin, end },
				suggestions: [
					{
						id: "formatAsLink",
						range: { begin, end },
						text: `[${urlText}](${urlText})`,
					},
					{
						id: "wrapInAngleBrackets",
						range: { begin, end },
						text: `<${urlText}>`,
					},
				],
			});
		}

		function checkTextNode(node: WithPosition<Link>) {
			const { position } = node.children[0];

			if (
				position?.start.offset === undefined ||
				position.end.offset === undefined
			) {
				return;
			}

			report(position.start.offset, position.end.offset, node.url);
		}

		return {
			visitors: {
				link(node) {
					if (
						node.children.length === 1 &&
						node.children[0].type === "text" &&
						node.children[0].value === node.url
					) {
						checkTextNode(node);
					}
				},
				text(node) {
					for (const match of node.value.matchAll(urlTester)) {
						const { index } = match;

						const begin = node.position.start.offset + index;
						const end = begin + match[0].length;
						report(begin, end, match[0]);
					}
				},
			},
		};
	},
});
