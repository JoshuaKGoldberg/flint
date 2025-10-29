import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
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
					let firstEntity: string | undefined;
					let firstIndex = Infinity;

					for (const entity of Object.keys(problematicEntities)) {
						const index = node.text.indexOf(entity);
						if (index !== -1 && index < firstIndex) {
							firstIndex = index;
							firstEntity = entity;
						}
					}

					if (firstEntity) {
						const escapedForms = problematicEntities[firstEntity];
						context.report({
							data: {
								brace: escapedForms.brace,
								entity: firstEntity,
								html: escapedForms.html,
							},
							message: "unescapedEntity",
							range: getTSNodeRange(node, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
