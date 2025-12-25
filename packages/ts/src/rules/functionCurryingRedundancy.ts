import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using `.apply()` or `.call()` or  when the context (`this` value) provides no benefit.",
		id: "functionCurryingRedundancy",
		preset: "logical",
	},
	messages: {
		unnecessaryCall: {
			primary:
				'This "currying" of a function without a defined context does nothing and can be simplified.',
			secondary: [
				"Using .call() or .apply() with null or undefined as the context provides no benefit over a direct function call.",
				"This adds unnecessary complexity and reduces code readability.",
			],
			suggestions: [
				"Replace the .call() or .apply() with a direct function call.",
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

					const methodName = node.expression.name.text;

					if (
						(methodName !== "call" && methodName !== "apply") ||
						!node.arguments.length
					) {
						return;
					}

					const firstArgument = node.arguments[0];

					if (
						firstArgument.kind === ts.SyntaxKind.NullKeyword ||
						firstArgument.kind === ts.SyntaxKind.UndefinedKeyword ||
						(ts.isIdentifier(firstArgument) &&
							firstArgument.text === "undefined")
					) {
						context.report({
							message: "unnecessaryCall",
							range: {
								begin: node.expression.name.getStart(context.sourceFile) - 1,
								end: node.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
