import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using debugger statements.",
		id: "debuggerStatements",
		preset: "logical",
	},
	messages: {
		noDebugger: {
			primary: "Debugger statements should not be used in production code.",
			secondary: [
				"The `debugger` statement causes the JavaScript runtime to pause execution and start a debugger if one is available, such as when browser developer tools are open.",
				"This can be useful during development, but should not be left in production code.",
			],
			suggestions: [
				"Remove the `debugger` statement before shipping this code to users.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				DebuggerStatement: (node) => {
					const range = {
						begin: node.getStart(),
						end: node.getEnd(),
					};

					context.report({
						fix: {
							range,
							text: "",
						},
						message: "noDebugger",
						range,
					});
				},
			},
		};
	},
});
