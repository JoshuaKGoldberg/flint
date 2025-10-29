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
			{ htmlEntity: string; braceEntity: string }
		> = {
			">": { htmlEntity: "&gt;", braceEntity: "{'>'}" },
			'"': { htmlEntity: "&quot;", braceEntity: '{"\\""}' },
			"'": { htmlEntity: "&apos;", braceEntity: '{"\'"}' },
			"}": { htmlEntity: "&#125;", braceEntity: "{'}'}" },
		};

		return {
			visitors: {
				JsxText(node: ts.JsxText) {
					const text = node.text;

					for (const [entity, escapedForms] of Object.entries(
						problematicEntities,
					)) {
						if (text.includes(entity)) {
							context.report({
								data: {
									braceEntity: escapedForms.braceEntity,
									entity,
									htmlEntity: escapedForms.htmlEntity,
								},
								message: "unescapedEntity",
								range: getTSNodeRange(node, context.sourceFile),
							});
							// Report once per text node, not for each character
							break;
						}
					}
				},
			},
		};
	},
});
