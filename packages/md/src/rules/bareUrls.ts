import { Link } from "mdast";

import { markdownLanguage } from "../language.js";
import { WithPosition } from "../nodes.js";

const URL_REGEX =
	/\b(?:https?:\/\/[^\s<>[\]()]+|mailto:[^\s<>[\]()@]+@[^\s<>[\]()]+)|[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}/g;

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
		// TODO: switch to parent link checks
		const textInValidLinks = new Set<number>();

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
			const textNode = node.children[0];
			const textPos = textNode.position;
			const linkPos = node.position;

			if (
				textPos?.start.offset === undefined ||
				textPos.end.offset === undefined
			) {
				return;
			}

			const linkLength = linkPos.end.offset - linkPos.start.offset;
			const textLength = textPos.end.offset - textPos.start.offset;

			if (linkLength > textLength) {
				textInValidLinks.add(textPos.start.offset);
			} else {
				report(textPos.start.offset, textPos.end.offset, node.url);
			}
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
					} else {
						for (const child of node.children) {
							if (
								child.type === "text" &&
								child.position?.start.offset !== undefined
							) {
								textInValidLinks.add(child.position.start.offset);
							}
						}
					}
				},
				text(node) {
					if (
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
						node.position == null ||
						textInValidLinks.has(node.position.start.offset)
					) {
						return;
					}

					const matches = node.value.matchAll(URL_REGEX);

					for (const match of matches) {
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
