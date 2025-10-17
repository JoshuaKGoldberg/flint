import type {
	Definition,
	ImageReference,
	LinkReference,
	Node,
	Root,
} from "mdast";

import type { WithPosition } from "../nodes.js";

import { markdownLanguage } from "../language.js";

export default markdownLanguage.createRule({
	about: {
		description: "Reports unused reference definitions.",
		id: "definitionUses",
		preset: "logical",
	},
	messages: {
		unusedDefinition: {
			primary: "This definition '{{ identifier }}' is never used.",
			secondary: [
				"Unused definitions add unnecessary clutter to the document and may indicate broken references or forgotten content.",
				"Reference-style definitions should be referenced by links, images, or other content in the document.",
				"Cleaning up unused definitions helps maintain a more organized document structure.",
			],
			suggestions: [
				"Remove the unused definition",
				"Add a reference to use this definition",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				root(node: WithPosition<Root>) {
					const definitions = new Map<
						string,
						{ begin: number; end: number; identifier: string }
					>();
					const usedIdentifiers = new Set<string>();

					// Traverse the tree to collect definitions and references
					function visit(n: Node): void {
						if (n.type === "definition") {
							const def = n as Definition;
							// Allow comment-style definitions like [//]:
							if (
								def.identifier !== "//" &&
								def.position?.start.offset !== undefined &&
								def.position.end.offset !== undefined
							) {
								const normalizedIdentifier = def.identifier.toLowerCase();
								definitions.set(normalizedIdentifier, {
									begin: def.position.start.offset,
									end: def.position.end.offset,
									identifier: def.identifier,
								});
							}
						} else if (n.type === "imageReference") {
							const ref = n as ImageReference;
							usedIdentifiers.add(ref.identifier.toLowerCase());
						} else if (n.type === "linkReference") {
							const ref = n as LinkReference;
							usedIdentifiers.add(ref.identifier.toLowerCase());
						}

						if ("children" in n && Array.isArray(n.children)) {
							for (const child of n.children as Node[]) {
								visit(child);
							}
						}
					}

					visit(node);

					// Report unused definitions
					for (const [normalizedIdentifier, definition] of definitions) {
						if (!usedIdentifiers.has(normalizedIdentifier)) {
							context.report({
								data: { identifier: definition.identifier },
								message: "unusedDefinition",
								range: {
									begin: definition.begin,
									end: definition.end,
								},
							});
						}
					}
				},
			},
		};
	},
});
