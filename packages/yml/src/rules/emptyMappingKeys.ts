import { ymlLanguage } from "../language.js";

export default ymlLanguage.createRule({
	about: {
		id: "emptyMappingKeys",
		preset: "logical",
	},
	messages: {
		emptyKey: {
			primary: "This mapping has an empty key, which is often a mistake.",
			secondary: ["TODO"],
			suggestions: ["TODO"],
		},
	},
	setup(context) {
		return {
			mappingKey(node) {
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
		};
	},
});
