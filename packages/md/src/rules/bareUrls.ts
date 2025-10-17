import { markdownLanguage } from "../language.js";

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
			primary:
				"This bare URL should be wrapped in angle brackets or formatted as a link.",
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
		// Track positions we've already reported to avoid duplicates
		const reportedRanges = new Set<string>();
		// Track text node offsets that are inside valid links (autolinks or regular links)
		const textInValidLinks = new Set<number>();

		function report(begin: number, end: number) {
			const key = `${begin}-${end}`;
			if (reportedRanges.has(key)) {
				return;
			}
			reportedRanges.add(key);
			context.report({
				message: "bareUrl",
				range: { begin, end },
			});
		}

		return {
			visitors: {
				// GFM converts bare http/https URLs to link nodes
				link(node) {
					// GFM autolink literals have the URL as both the text content and href
					if (
						node.children.length === 1 &&
						node.children[0].type === "text" &&
						node.children[0].value === node.url
					) {
						const textNode = node.children[0];
						const textPos = textNode.position;
						const linkPos = node.position;

						if (
							textPos?.start.offset === undefined ||
							textPos.end.offset === undefined
						) {
							return;
						}

						// If the link node spans more characters than the text node,
						// it has wrapper characters (angle brackets) - it's a valid autolink
						const textLength = textPos.end.offset - textPos.start.offset;
						const linkLength = linkPos.end.offset - linkPos.start.offset;

						// Autolinks have 2 extra characters: < and >
						if (linkLength > textLength) {
							// Valid autolink - mark text as in valid link
							textInValidLinks.add(textPos.start.offset);
							return;
						}

						// It's a bare URL auto-converted by GFM - report it
						report(textPos.start.offset, textPos.end.offset);
					} else {
						// Regular links [text](url) - mark all text children as in valid links
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
						report(begin, end);
					}
				},
			},
		};
	},
});
