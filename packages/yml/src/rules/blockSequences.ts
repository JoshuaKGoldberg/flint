import { ymlLanguage } from "../language.js";

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
					context.report({
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
