import type * as yaml from "yaml-unist-parser";

import { ymlLanguage } from "../language.js";

/**
 * Calculate the expected indentation for a flow mapping's pairs when converted to block style.
 */
function calculateIndent(node: yaml.FlowMapping, sourceText: string): string {
	// Find the start of the line containing this node
	const lineStart =
		sourceText.lastIndexOf("\n", node.position.start.offset) + 1;
	const beforeNode = sourceText.substring(
		lineStart,
		node.position.start.offset,
	);

	// Count leading whitespace
	const leadingWhitespace = beforeNode.match(/^\s*/)?.[0] ?? "";

	// Add 2 spaces for standard YAML indentation
	return leadingWhitespace + "  ";
}

/**
 * Check if a flow mapping can be safely converted to block style.
 */
function canConvertToBlock(node: yaml.FlowMapping): boolean {
	// Check for null pairs (empty keys or values)
	for (const child of node.children) {
		if (child.type === "flowMappingItem") {
			const [key, value] = child.children;
			if (key.children.length === 0 || value.children.length === 0) {
				return false;
			}
		}
	}

	return true;
}

/**
 * Convert a flow mapping to block style.
 */
function convertToBlock(node: yaml.FlowMapping, sourceText: string): string {
	const indent = calculateIndent(node, sourceText);
	const pairs: string[] = [];

	for (const child of node.children) {
		if (child.type === "flowMappingItem") {
			const [keyNode, valueNode] = child.children;

			// Extract key text (excluding the leading/trailing positions)
			const keyText = sourceText.substring(
				keyNode.children[0]?.position.start.offset ??
					keyNode.position.start.offset,
				keyNode.children[0]?.position.end.offset ?? keyNode.position.end.offset,
			);

			// Extract value text
			const valueChild = valueNode.children[0];
			if (valueChild) {
				const valueText = sourceText.substring(
					valueChild.position.start.offset,
					valueChild.position.end.offset,
				);

				pairs.push(`${indent}${keyText}: ${valueText}`);
			}
		}
	}

	return "\n" + pairs.join("\n");
}

export default ymlLanguage.createRule({
	about: {
		description: "Prefer block-style mappings over flow-style mappings.",
		id: "blockMappings",
		preset: "stylistic",
	},
	messages: {
		preferBlock: {
			primary:
				"Prefer block-style mappings over flow-style mappings for improved readability.",
			secondary: [
				"Flow-style mappings (e.g., {key: value}) can be harder to read and maintain, especially with nested structures.",
				"Block-style mappings use indentation to show structure, making the YAML more readable and consistent with common YAML conventions.",
			],
			suggestions: ["Convert to block-style mapping."],
		},
	},
	setup(context) {
		return {
			visitors: {
				flowMapping: (node) => {
					const canFix = canConvertToBlock(node);

					context.report({
						fix: canFix
							? {
									range: {
										begin: node.position.start.offset,
										end: node.position.end.offset,
									},
									text: convertToBlock(node, context.sourceText),
								}
							: undefined,
						message: "preferBlock",
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
