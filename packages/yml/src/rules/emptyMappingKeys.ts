import { ymlLanguage } from "../language.js";

export default ymlLanguage.createRule({
	about: {
		description: "TODO",
		id: "emptyMappingKeys",
		preset: "logical",
	},
	messages: {
		emptyKey: {
			primary: "This mapping has an empty key, which is often a mistake.",
			secondary: [
				"Empty keys are invalid in YAML and may cause parsers to reject the document or misinterpret its structure.",
				"Even if allowed by a parser, empty keys can be confusing for developers and lead to accidental mistakes in code.",
			],
			suggestions: ["TODO"],
		},
	},
	setup(context) {
		return {
			visitors: {
				mappingKey: (node) => {
					if (node.children.length === 0) {
						context.report({
							message: "emptyKey",
							range: {
								begin: node.position.start.offset,
								end: node.position.end.offset + 1,
							},
						});
					}
				},
			},
		};
	},
});
