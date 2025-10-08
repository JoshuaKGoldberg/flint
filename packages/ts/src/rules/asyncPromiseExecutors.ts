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
		function isGlobalPromiseConstructor(node: ts.Expression): boolean {
			if (node.kind !== ts.SyntaxKind.Identifier) {
				return false;
			}

			const symbol = context.typeChecker.getSymbolAtLocation(node);
			if (!symbol) {
				return false;
			}

			const declarations = symbol.getDeclarations();
			if (!declarations || declarations.length === 0) {
				return false;
			}

			// Check if any declaration is in a lib.d.ts file
			return declarations.some((declaration) => {
				const sourceFile = declaration.getSourceFile();
				return (
					sourceFile.hasNoDefaultLib ||
					/\/lib\.[^/]*\.d\.ts$/.test(sourceFile.fileName)
				);
			});
		}

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
					if (!isGlobalPromiseConstructor(node.expression)) {
						return;
					}

					if (!node.arguments || node.arguments.length === 0) {
						return;
					}

					const executor = node.arguments[0];

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
