import type { Definition, Image, Link, Node, Root } from "mdast";

import type { WithPosition } from "../nodes.js";

import { markdownLanguage } from "../language.js";

export default markdownLanguage.createRule({
	about: {
		description:
			"Reports resource links/images with URLs that match definition identifiers.",
		id: "referenceLikeUrls",
		preset: "logical",
	},
	messages: {
		imageReferenceLike: {
			primary:
				"This image uses a URL '{{ url }}' that matches a definition identifier.",
			secondary: [
				"When a resource image (![text](url)) has a URL that matches a definition identifier, it's likely a mistake.",
				"You probably meant to use a reference image (![text][id]) instead of an inline URL.",
				"Using the reference syntax makes your Markdown more maintainable and avoids confusion.",
			],
			suggestions: [
				"Change to reference syntax: ![text][{{ url }}]",
				"Use a different URL if this is intentional",
			],
		},
		linkReferenceLike: {
			primary:
				"This link uses a URL '{{ url }}' that matches a definition identifier.",
			secondary: [
				"When a resource link ([text](url)) has a URL that matches a definition identifier, it's likely a mistake.",
				"You probably meant to use a reference link ([text][id]) instead of an inline URL.",
				"Using the reference syntax makes your Markdown more maintainable and avoids confusion.",
			],
			suggestions: [
				"Change to reference syntax: [text][{{ url }}]",
				"Use a different URL if this is intentional",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				root(node: WithPosition<Root>) {
					const definitionIdentifiers = new Set<string>();

					// Collect all definition identifiers
					function collectDefinitions(n: Node): void {
						if (n.type === "definition") {
							const def = n as Definition;
							// Identifiers are case-insensitive in Markdown
							definitionIdentifiers.add(def.identifier.toLowerCase());
						}

						if ("children" in n && Array.isArray(n.children)) {
							for (const child of n.children as Node[]) {
								collectDefinitions(child);
							}
						}
					}

					// Check for resource links/images that use definition identifiers as URLs
					function checkNodes(n: Node): void {
						if (n.type === "link") {
							const link = n as Link;
							// Check if the URL matches a definition identifier
							const urlLower = link.url.toLowerCase();
							if (
								definitionIdentifiers.has(urlLower) &&
								link.position?.start.offset !== undefined &&
								link.position.end.offset !== undefined
							) {
								context.report({
									data: { url: link.url },
									message: "linkReferenceLike",
									range: {
										begin: link.position.start.offset,
										end: link.position.end.offset,
									},
								});
							}
						} else if (n.type === "image") {
							const image = n as Image;
							// Check if the URL matches a definition identifier
							const urlLower = image.url.toLowerCase();
							if (
								definitionIdentifiers.has(urlLower) &&
								image.position?.start.offset !== undefined &&
								image.position.end.offset !== undefined
							) {
								context.report({
									data: { url: image.url },
									message: "imageReferenceLike",
									range: {
										begin: image.position.start.offset,
										end: image.position.end.offset,
									},
								});
							}
						}

						if ("children" in n && Array.isArray(n.children)) {
							for (const child of n.children as Node[]) {
								checkNodes(child);
							}
						}
					}

					collectDefinitions(node);
					checkNodes(node);
				},
			},
		};
	},
});
