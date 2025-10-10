import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports Symbol() calls without description arguments.",
		id: "symbolDescriptions",
		preset: "stylistic",
	},
	messages: {
		missingDescription: {
			primary: "Symbols should have descriptions for easier debugging.",
			secondary: [
				"Creating a symbol without a description makes debugging difficult, as the symbol's purpose isn't clear when inspecting it.",
				"While the description doesn't affect the symbol's uniqueness, it appears in the symbol's string representation and can be accessed via `Symbol.prototype.description`.",
			],
			suggestions: [
				"Add a descriptive string argument to the Symbol constructor that explains the symbol's purpose.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node) => {
					// Check if this is a call to Symbol()
					if (
						ts.isIdentifier(node.expression) &&
						node.expression.text === "Symbol" &&
						node.arguments.length === 0
					) {
						const range = {
							begin: node.getStart(context.sourceFile),
							end: node.getEnd(),
						};

						context.report({
							message: "missingDescription",
							range,
						});
					}
				},
			},
		};
	},
});
