import ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports calls to console methods.",
		id: "consoleCalls",
		preset: "untyped",
	},
	messages: {
		noConsole: {
			primary: "Console method calls should not be used in production code.",
			secondary: [
				"Console methods like `console.log`, `console.warn`, and `console.error` are useful during development but should typically be removed before shipping to production.",
				"Consider using a proper logging library that can be configured for different environments.",
			],
			suggestions: [
				"Remove the console call before shipping this code to users.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node) => {
					if (!ts.isPropertyAccessExpression(node.expression)) {
						return;
					}

					const propertyAccess = node.expression;

					if (
						!ts.isIdentifier(propertyAccess.expression) ||
						propertyAccess.expression.text !== "console"
					) {
						return;
					}

					const range = {
						begin: node.getStart(),
						end: node.getEnd(),
					};

					context.report({
						message: "noConsole",
						range,
					});
				},
			},
		};
	},
});
