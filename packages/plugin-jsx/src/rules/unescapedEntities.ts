import { typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const problematicEntities: Record<string, { brace: string; html: string }> = {
	'"': { brace: '{"\\""}', html: "&quot;" },
	"'": { brace: '{"\'"}', html: "&#39;" },
	">": { brace: "{'>'}", html: "&gt;" },
	"}": { brace: "{'}'}", html: "&#125;" },
};

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallow unescaped HTML entities in JSX text that may cause rendering issues.",
		id: "unescapedEntities",
		preset: "stylistic",
	},
	messages: {
		unescapedEntity: {
			primary: "This unescaped entity `{{ entity }}` may not render properly.",
			secondary: [
				"Certain characters like >, <, \", ', {, and } can cause issues in JSX when not properly escaped.",
				"React may not render these characters correctly or they might break JSX syntax.",
			],
			suggestions: [
				"Use HTML entities: {{ html }}",
				"Wrap in JSX expression: {{ brace }}",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				JsxText(node: ts.JsxText) {
					const text = node.text;
					const nodeStart = node.getStart(context.sourceFile);
					const reports: {
						begin: number;
						data: { brace: string; entity: string; html: string };
						end: number;
					}[] = [];

					// Find all occurrences of problematic entities
					for (const [entity, escapedForms] of Object.entries(
						problematicEntities,
					)) {
						let index = 0;
						while ((index = text.indexOf(entity, index)) !== -1) {
							reports.push({
								begin: nodeStart + index,
								data: {
									brace: escapedForms.brace,
									entity,
									html: escapedForms.html,
								},
								end: nodeStart + index + entity.length,
							});
							index += entity.length;
						}
					}

					// Sort reports by position
					reports.sort((a, b) => a.begin - b.begin);

					// Report each one
					for (const report of reports) {
						context.report({
							data: report.data,
							message: "unescapedEntity",
							range: {
								begin: report.begin,
								end: report.end,
							},
						});
					}
				},
			},
		};
	},
});
