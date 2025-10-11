import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports labels that are declared but never used.",
		id: "unusedLabels",
		preset: "stylistic",
	},
	messages: {
		unusedLabel: {
			primary:
				"Label '{{ labelName }}' is declared but never used with a break or continue statement.",
			secondary: [
				"Labels in JavaScript and TypeScript are used to identify loops or blocks, allowing break and continue statements to reference them.",
				"If a label is declared but never referenced, it serves no purpose and should be removed to keep the code clean.",
			],
			suggestions: [
				"Remove the unused label to simplify the code.",
				"Add a break or continue statement that references this label if it was intended to be used.",
			],
		},
	},
	setup(context) {
		// Collect all labels first
		const declaredLabels = new Map<string, ts.LabeledStatement>();
		const usedLabels = new Set<string>();

		// First pass: collect all labeled statements and their uses
		function collectLabels(node: ts.Node) {
			if (ts.isLabeledStatement(node)) {
				declaredLabels.set(node.label.text, node);
			}
			if (ts.isBreakStatement(node) && node.label) {
				usedLabels.add(node.label.text);
			}
			if (ts.isContinueStatement(node) && node.label) {
				usedLabels.add(node.label.text);
			}
			ts.forEachChild(node, collectLabels);
		}

		collectLabels(context.sourceFile);

		// Now report unused labels
		for (const [labelName, node] of declaredLabels) {
			if (!usedLabels.has(labelName)) {
				context.report({
					data: {
						labelName,
					},
					message: "unusedLabel",
					range: {
						begin: node.label.getStart(context.sourceFile),
						end: node.label.getEnd(),
					},
				});
			}
		}

		// Return empty visitors since we've already done the work
		return {
			visitors: {},
		};
	},
});
