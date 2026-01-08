import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";
import { isGlobalDeclarationOfName } from "../utils/isGlobalDeclarationOfName.ts";

const promiseMethods = new Set(["all", "allSettled", "any", "race"]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using await on promises passed to Promise.all, Promise.allSettled, Promise.any, or Promise.race.",
		id: "awaitInsidePromiseMethods",
		preset: "logical",
		strictness: "strict",
	},
	messages: {
		unnecessaryAwait: {
			primary:
				"Awaiting promises inside {{ method }} is redundant because it accepts promises directly.",
			secondary: [
				"Promise methods like `Promise.all()` accept an iterable of promises and handle their resolution internally.",
				"Using `await` on individual promises before passing them defeats the purpose of parallel execution.",
				"The awaited promise will resolve before the others are even considered, eliminating any parallelism benefit.",
			],
			suggestions: ["Remove the `await` keyword to allow parallel execution."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile, typeChecker }) => {
					if (!ts.isPropertyAccessExpression(node.expression)) {
						return;
					}

					const { expression, name } = node.expression;

					if (
						!ts.isIdentifier(name) ||
						!promiseMethods.has(name.text) ||
						!ts.isIdentifier(expression) ||
						!isGlobalDeclarationOfName(expression, "Promise", typeChecker)
					) {
						return;
					}

					const methodName = name.text;
					if (
						!node.arguments.length ||
						!ts.isArrayLiteralExpression(node.arguments[0])
					) {
						return;
					}

					const arrayArgument = node.arguments[0];

					for (const element of arrayArgument.elements) {
						if (!ts.isAwaitExpression(element)) {
							continue;
						}

						context.report({
							data: { method: `Promise.${methodName}()` },
							message: "unnecessaryAwait",
							range: {
								begin: element.getStart(sourceFile),
								end: element.expression.getStart(sourceFile) - 1,
							},
						});
					}
				},
			},
		};
	},
});
