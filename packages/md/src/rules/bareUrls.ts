import type { RuleContext } from "@flint.fyi/core";

import { Link } from "mdast";

import { markdownLanguage, type MarkdownServices } from "../language.js";
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
	setup() {
		// TODO: Add parent nodes to AST?
		// That way this will be compatible with createOnce-style API in:
		// https://github.com/JoshuaKGoldberg/flint/issues/356
		const textInValidLinks = new Set<number>();

		function report(
			context: MarkdownServices & RuleContext<"bareUrl">,
			begin: number,
			end: number,
			urlText: string,
		) {
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

		function checkTextNode(
			context: MarkdownServices & RuleContext<"bareUrl">,
			node: WithPosition<Link>,
		) {
			const textNode = node.children[0];
			const textPosition = textNode.position;

			if (
				textPosition?.start.offset === undefined ||
				textPosition.end.offset === undefined
			) {
				return;
			}

			const linkPosition = node.position;
			const linkLength = linkPosition.end.offset - linkPosition.start.offset;
			const textLength = textPosition.end.offset - textPosition.start.offset;

			if (linkLength > textLength) {
				textInValidLinks.add(textPosition.start.offset);
			} else {
				report(
					context,
					textPosition.start.offset,
					textPosition.end.offset,
					node.url,
				);
			}
		}

		return {
			visitors: {
				link(node, context) {
					if (
						node.children[0].type === "text" &&
						node.children[0].value === node.url
					) {
						checkTextNode(context, node);
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
				text(node, context) {
					if (textInValidLinks.has(node.position.start.offset)) {
						return;
					}

					for (const match of node.value.matchAll(urlTester)) {
						const { index } = match;

						const begin = node.position.start.offset + index;
						const end = begin + match[0].length;
						report(context, begin, end, match[0]);
					}
				},
			},
		};
	},
});
