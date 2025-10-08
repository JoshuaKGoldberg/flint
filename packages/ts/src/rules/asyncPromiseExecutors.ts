import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using async functions as Promise executor functions.",
		id: "asyncPromiseExecutors",
		preset: "logical",
	},
	messages: {
		asyncPromiseExecutor: {
			primary: "Promise executor functions should not be async.",
			secondary: [
				"The Promise executor function is called synchronously by the Promise constructor.",
				"If an async function is used as a Promise executor, thrown errors will not be caught by the Promise and will instead result in unhandled rejections.",
				"Additionally, if a Promise executor function is using `await`, there's probably no need to use the `new Promise` constructor.",
			],
			suggestions: [
				"Remove the `async` keyword from the executor function.",
				"If you need to use `await` inside the Promise, consider restructuring your code to avoid the Promise constructor.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				NewExpression: (node) => {
					// Check if this is a Promise constructor
					if (
						node.expression.kind !== ts.SyntaxKind.Identifier ||
						node.expression.getText() !== "Promise"
					) {
						return;
					}

					// Check if there are arguments
					if (!node.arguments || node.arguments.length === 0) {
						return;
					}

					const executor = node.arguments[0];

					// Check if the executor is an async arrow function or async function expression
					const isAsyncArrowFunction =
						ts.isArrowFunction(executor) &&
						(executor.modifiers?.some(
							(mod) => mod.kind === ts.SyntaxKind.AsyncKeyword,
						) ??
							false);

					const isAsyncFunctionExpression =
						ts.isFunctionExpression(executor) &&
						(executor.modifiers?.some(
							(mod) => mod.kind === ts.SyntaxKind.AsyncKeyword,
						) ??
							false);

					if (isAsyncArrowFunction || isAsyncFunctionExpression) {
						context.report({
							message: "asyncPromiseExecutor",
							range: {
								begin: executor.getStart(),
								end: executor.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
