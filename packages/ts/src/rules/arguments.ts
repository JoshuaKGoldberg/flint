import ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using the `arguments` object.",
		id: "arguments",
		preset: "logical",
	},
	messages: {
		noArguments: {
			primary: "Use rest parameters instead of `arguments`.",
			secondary: [
				"The `arguments` object is an array-like object that does not have array methods like `map`, `filter`, or `forEach`.",
				"Rest parameters provide a real array and are the modern way to access variadic function arguments.",
			],
			suggestions: [
				"Replace `arguments` with a rest parameter like `...args`.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				Identifier: (node, { sourceFile, typeChecker }) => {
					if (node.text !== "arguments") {
						return;
					}

					if (!isArgumentsReference(node, typeChecker)) {
						return;
					}

					context.report({
						message: "noArguments",
						range: {
							begin: node.getStart(sourceFile),
							end: node.getEnd(),
						},
					});
				},
			},
		};
	},
});

function isArgumentsReference(
	node: ts.Identifier,
	typeChecker: ts.TypeChecker,
): boolean {
	const symbol = typeChecker.getSymbolAtLocation(node);
	if (!symbol) {
		return true;
	}

	const declarations = symbol.getDeclarations();
	if (!declarations || declarations.length === 0) {
		return true;
	}

	for (const declaration of declarations) {
		if (ts.isParameter(declaration)) {
			return false;
		}

		if (ts.isVariableDeclaration(declaration)) {
			return false;
		}

		if (ts.isFunctionDeclaration(declaration)) {
			return false;
		}
	}

	return true;
}
