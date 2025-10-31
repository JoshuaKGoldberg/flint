import type * as yamlParser from "yaml-unist-parser";

import { ymlLanguage } from "../language.js";

/**
 * Calculate the expected indentation for a sequence based on its parent context
 */
function getExpectedIndent(node: yamlParser.FlowSequence): string {
	// Find the mapping value that contains this sequence
	let current: yamlParser.YamlUnistNode | null | undefined = node._parent;

	while (current) {
		if (current.type === "mappingValue" && current._parent) {
			const mappingItem = current._parent;
			if (mappingItem.type === "mappingItem" && mappingItem._parent) {
				const mapping = mappingItem._parent;
				// Get the column of the mapping item (which has the key)
				const mappingItemColumn = mappingItem.position.start.column;
				// Add 2 spaces for standard YAML indentation
				return " ".repeat(mappingItemColumn + 1);
			}
		}
		current = current._parent;
	}

	// Default to 2 spaces if we can't determine parent indentation
	return "  ";
}

/**
 * Extract the text content of a node's value
 */
function getNodeText(
	node: yamlParser.YamlUnistNode,
	sourceText: string,
): string {
	return sourceText.substring(
		node.position.start.offset,
		node.position.end.offset,
	);
}

/**
 * Build fix text to convert flow sequence to block sequence
 */
function buildBlockSequenceFix(
	node: yamlParser.FlowSequence,
	sourceText: string,
): string {
	const indent = getExpectedIndent(node);
	const items: string[] = [];

	for (const item of node.children) {
		if (item.children.length > 0) {
			const child = item.children[0];
			const itemText = getNodeText(child, sourceText);
			items.push(`\n${indent}- ${itemText}`);
		}
	}

	return items.join("");
}

export default ymlLanguage.createRule({
	about: {
		description: "Prefer block style sequences over flow style sequences.",
		id: "blockSequences",
		preset: "stylistic",
	},
	messages: {
		flowSequence: {
			primary: "Prefer block style sequences over flow style sequences.",
			secondary: [
				"Block style sequences use hyphens and are generally more readable for multi-item lists.",
				"Flow style sequences use brackets and are more compact but less clear in most cases.",
			],
			suggestions: [
				"Rewrite the flow sequence using block style with each item on its own line preceded by a hyphen.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				flowSequence: (node) => {
					const fixText = buildBlockSequenceFix(node, context.sourceText);

					context.report({
						fix: {
							range: {
								begin: node.position.start.offset,
								end: node.position.end.offset,
							},
							text: fixText,
						},
						message: "flowSequence",
						range: {
							begin: node.position.start.offset,
							end: node.position.end.offset,
						},
					});
				},
			},
		};
	},
});
