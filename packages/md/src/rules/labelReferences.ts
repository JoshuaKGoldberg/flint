import type { Definition, Node, Root, Text } from "mdast";

import type { WithPosition } from "../nodes.js";

import { markdownLanguage } from "../language.js";

export default markdownLanguage.createRule({
	about: {
		description: "Reports missing label references.",
		id: "labelReferences",
		preset: "logical",
	},
	messages: {
		missingLabel: {
			primary: "This label reference '{{ identifier }}' has no definition.",
			secondary: [
				"Markdown allows you to use labels as placeholders for URLs in links and images.",
				"If a label is referenced but never defined, Markdown doesn't render a link and instead renders plain text.",
				"Each label reference must have a corresponding definition somewhere in the document.",
			],
			suggestions: [
				"Add a definition for this label",
				"Remove the label reference if it's not needed",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				root(node: WithPosition<Root>) {
					const definitions = new Set<string>();
					const missingReferences: {
						begin: number;
						end: number;
						identifier: string;
					}[] = [];

					// Pattern to match label references: ![text][label], [text][label], [label][], or [label]
					// Includes optional ! for images
					const labelPattern =
						/!?\[(?<left>[^[\]\\]*)\](?:\[(?<right>[^\]\\]*)\])?/g;

					// Traverse the tree to collect definitions and text nodes
					function visit(n: Node): void {
						if (n.type === "definition") {
							const def = n as Definition;
							definitions.add(def.identifier.toLowerCase());
						} else if (n.type === "text") {
							const textNode = n as Text;
							if (
								textNode.position?.start.offset === undefined ||
								textNode.position.end.offset === undefined
							) {
								return;
							}

							let match: null | RegExpExecArray;

							while ((match = labelPattern.exec(textNode.value))) {
								const { left, right } = match.groups as {
									left: string;
									right?: string;
								};

								// Skip empty references like [][]
								if (!left && !right) {
									continue;
								}

								// Determine the label: use right if it exists (even if empty), otherwise left
								let identifier: string;
								if (right !== undefined) {
									// [text][label] or [label][]
									identifier = right.trim() || left.trim();
								} else {
									// [label]
									identifier = left.trim();
								}

								if (!identifier) {
									continue;
								}

								const startOffset =
									textNode.position.start.offset + match.index;
								const endOffset = startOffset + match[0].length;

								missingReferences.push({
									begin: startOffset,
									end: endOffset,
									identifier,
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

					// Filter out references that have definitions
					const actuallyMissing = missingReferences.filter(
						(ref) => !definitions.has(ref.identifier.toLowerCase()),
					);

					// Report missing label references
					for (const reference of actuallyMissing) {
						context.report({
							data: { identifier: reference.identifier },
							message: "missingLabel",
							range: {
								begin: reference.begin,
								end: reference.end,
							},
						});
					}
				},
			},
		};
	},
});
