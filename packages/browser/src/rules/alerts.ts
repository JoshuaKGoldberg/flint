import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports test cases that are identical to previous test cases.",
		id: "alerts",
		preset: "logical",
	},
	messages: {
		duplicateTest: {
			primary: "TODO",
			secondary: ["TODO."],
			suggestions: ["TODO."],
		},
	},
	setup(context) {
		return {
			visitors: {
				// TODO
			},
		};
	},
});
