import { ymlLanguage } from "../language.js";

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
			suggestions: ["TODO"],
		},
	},
	setup(context) {
		return {
			visitors: {
				flowMapping: (node) => {
					context.report({
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
