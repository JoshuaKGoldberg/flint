import { getTSNodeRange } from "../getTSNodeRange.js";
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
				"The debugger statement causes the JavaScript runtime to pause execution and start a debugger if one is available.",
				"This can be useful during development, but should not be left in production code.",
			],
			suggestions: [
				"Remove the debugger statement or use a proper logging solution.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				DebuggerStatement: (node) => {
					context.report({
						message: "noDebugger",
						range: getTSNodeRange(node, context.sourceFile),
					});
				},
			},
		};
	},
});
