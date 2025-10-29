import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallow unescaped HTML entities in JSX text that may cause rendering issues.",
		id: "unescapedEntities",
		preset: "stylistic",
	},
	messages: {
		unescapedEntity: {
			primary:
				"Unescaped entity `{{ entity }}` found in JSX text. Use HTML entity ({{ htmlEntity }}) or wrap in braces ({{ braceEntity }}).",
			secondary: [
				"Certain characters like >, <, \", ', {, and } can cause issues in JSX when not properly escaped.",
				"React may not render these characters correctly or they might break JSX syntax.",
			],
			suggestions: [
				"Use HTML entities: {{ htmlEntity }}",
				"Wrap in JSX expression: {{ braceEntity }}",
			],
		},
	},
	setup(context) {
		// Characters that should be escaped in JSX text content
		const problematicEntities: Record<
			string,
			{ braceEntity: string; htmlEntity: string }
		> = {
			'"': { braceEntity: '{"\\""}', htmlEntity: "&quot;" },
			"'": { braceEntity: '{"\'"}', htmlEntity: "&#39;" },
			">": { braceEntity: "{'>'}", htmlEntity: "&gt;" },
			"}": { braceEntity: "{'}'}", htmlEntity: "&#125;" },
		};

		return {
			visitors: {
				JsxText(node: ts.JsxText) {
					const text = node.text;

					// Find the first problematic entity in the text
					let firstEntity: string | undefined;
					let firstIndex = Infinity;

					for (const entity of Object.keys(problematicEntities)) {
						const index = text.indexOf(entity);
						if (index !== -1 && index < firstIndex) {
							firstIndex = index;
							firstEntity = entity;
						}
					}

					if (firstEntity) {
						const escapedForms = problematicEntities[firstEntity];
						context.report({
							data: {
								braceEntity: escapedForms.braceEntity,
								entity: firstEntity,
								htmlEntity: escapedForms.htmlEntity,
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
