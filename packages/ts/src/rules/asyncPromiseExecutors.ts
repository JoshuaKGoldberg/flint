import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";
import { isGlobalPromiseConstructor } from "../utils/isGlobalPromiseConstructor.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using async functions as Promise executor functions.",
		id: "asyncPromiseExecutors",
		preset: "logical",
	},
	messages: {
		asyncPromiseExecutor: {
			primary:
				"Promise executor functions should not be async because errors thrown within them won't be caught properly.",
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
		function getAsyncKeywordRange(
			executor: ts.ArrowFunction | ts.FunctionExpression,
		): null | { begin: number; end: number } {
			const asyncModifier = executor.modifiers?.find(
				(mod) => mod.kind === ts.SyntaxKind.AsyncKeyword,
			);
			if (!asyncModifier) {
				return null;
			}
			return {
				begin: asyncModifier.getStart(),
				end: asyncModifier.getEnd(),
			};
		}

		return {
			visitors: {
				NewExpression: (node) => {
					if (
						!isGlobalPromiseConstructor(node.expression, context.typeChecker)
					) {
						return;
					}

					if (!node.arguments?.length) {
						return;
					}

					const executor = node.arguments[0];

					const isAsync =
						(ts.isArrowFunction(executor) ||
							ts.isFunctionExpression(executor)) &&
						(executor.modifiers?.some(
							(mod) => mod.kind === ts.SyntaxKind.AsyncKeyword,
						) ??
							false);

					if (isAsync) {
						const range = getAsyncKeywordRange(executor);
						if (range) {
							context.report({
								message: "asyncPromiseExecutor",
								range,
							});
						}
					}
				},
			},
		};
	},
});
