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
				CallExpression: (node, { sourceFile, typeChecker }) => {
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

					// Verify that the object being called is actually a function
					const objectType = typeChecker.getTypeAtLocation(
						node.expression.expression,
					);
					const callSignatures = objectType.getCallSignatures();

					if (callSignatures.length === 0) {
						return;
					}

					const firstArgument = node.arguments[0];

					if (
						firstArgument.kind === ts.SyntaxKind.NullKeyword ||
						firstArgument.kind === ts.SyntaxKind.UndefinedKeyword ||
						(ts.isIdentifier(firstArgument) &&
							firstArgument.text === "undefined")
					) {
						// Create the fix
						const functionExpression =
							node.expression.expression.getText(sourceFile);
						const methodArguments = node.arguments.slice(1);

						let fixText: string;
						if (methodName === "apply") {
							// For .apply(), the second argument is an array of arguments
							if (methodArguments.length > 0) {
								const argsArray = methodArguments[0];
								fixText = `${functionExpression}(...${argsArray.getText(sourceFile)})`;
							} else {
								fixText = `${functionExpression}()`;
							}
						} else {
							// For .call(), arguments are passed directly
							const argsText = methodArguments
								.map((arg) => arg.getText(sourceFile))
								.join(", ");
							fixText = `${functionExpression}(${argsText})`;
						}

						context.report({
							fix: {
								range: {
									begin: node.getStart(sourceFile),
									end: node.getEnd(),
								},
								text: fixText,
							},
							message: "unnecessaryCall",
							range: {
								begin: node.expression.name.getStart(sourceFile) - 1,
								end: node.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
