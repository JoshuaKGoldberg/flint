import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using .call() or .apply() when the context (this value) provides no benefit.",
		id: "unnecessaryFunctionCurries",
		preset: "logical",
	},
	messages: {
		unnecessaryCall: {
			primary:
				"Prefer direct function calls over unnecessary .call() with null or undefined context.",
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

					const propertyAccess = node.expression;
					const methodName = propertyAccess.name.text;

					if (methodName !== "call" && methodName !== "apply") {
						return;
					}

					if (node.arguments.length === 0) {
						return;
					}

					const firstArgument = node.arguments[0];

					if (
						firstArgument.kind === ts.SyntaxKind.NullKeyword ||
						firstArgument.kind === ts.SyntaxKind.UndefinedKeyword ||
						(ts.isIdentifier(firstArgument) &&
							firstArgument.text === "undefined")
					) {
						const dotPosition = propertyAccess.name.getStart(context.sourceFile) - 1;
						
						const range = {
							begin: dotPosition,
							end: node.getEnd(),
						};

						context.report({
							message: "unnecessaryCall",
							range,
						});
					}
				},
			},
		};
	},
});
