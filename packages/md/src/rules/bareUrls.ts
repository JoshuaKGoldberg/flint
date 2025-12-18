import { type RuleContext, runtimeBase } from "@flint.fyi/core";
import { Link, type Root } from "mdast";

import { markdownLanguage, type MarkdownServices } from "../language.js";
import { WithPosition } from "../nodes.js";

const urlTester = /(?:https?:\/\/|mailto:)\S+|[\w.+-]+@[\w.-]+\.\w+/gi;

type Context = MarkdownServices & RuleContext<"bareUrl">;

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
		const textInValidLinks = new Map<WithPosition<Root>, Set<number>>();

		return {
			...runtimeBase,
			visitors: {
				link: (node, context) => {
					if (
						node.children[0].type === "text" &&
						node.children[0].value === node.url
					) {
						checkTextNode(context, node, textInValidLinks);
					} else {
						for (const child of node.children) {
							if (
								child.type === "text" &&
								child.position?.start.offset !== undefined
							) {
								getOrInsert(textInValidLinks, context.root, new Set()).add(
									child.position.start.offset,
								);
							}
						}
					}
				},
				text(node, context) {
					if (
						getOrInsert(textInValidLinks, context.root, new Set()).has(
							node.position.start.offset,
						)
					) {
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

function checkTextNode(
	context: Context,
	node: WithPosition<Link>,
	textInValidLinks: Map<WithPosition<Root>, Set<number>>,
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
		getOrInsert(textInValidLinks, context.root, new Set()).add(
			textPosition.start.offset,
		);
	} else {
		report(
			context,
			textPosition.start.offset,
			textPosition.end.offset,
			node.url,
		);
	}
}

function report(context: Context, begin: number, end: number, urlText: string) {
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

/** Ponyfill https://github.com/tc39/proposal-upsert. */
function getOrInsert<K, V>(map: Map<K, V>, key: K, defaultValue: V): V {
	if (!map.has(key)) {
		map.set(key, defaultValue);
	}
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Already checked.
	return map.get(key)!;
}
