import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallows using `new` with global non-constructor functions like Symbol and BigInt.",
		id: "newNativeNonConstructors",
		preset: "logical",
	},
	messages: {
		noNewNonConstructor: {
			primary:
				"Prefer calling {{ name }} directly over using `new` with {{ name }}.",
			secondary: [
				"`Symbol` and `BigInt` are not constructors and will throw a `TypeError` when called with `new`.",
				"These functions should be called directly without the `new` keyword to create their respective values.",
			],
			suggestions: ["Remove the `new` keyword and call the function directly."],
		},
	},
	setup(context) {
		const nonConstructors = new Set(["BigInt", "Symbol"]);

		return {
			visitors: {
				NewExpression: (node) => {
					if (!ts.isIdentifier(node.expression)) {
						return;
					}

					const name = node.expression.text;
					if (!nonConstructors.has(name)) {
						return;
					}

					// Check if this is actually the global Symbol/BigInt
					const symbol = context.typeChecker.getSymbolAtLocation(
						node.expression,
					);
					if (!symbol) {
						return;
					}

					// Only report if it's from the global scope (lib.d.ts)
					// Skip if it's declared in the current file (user-defined class)
					const declarations = symbol.getDeclarations();
					if (!declarations || declarations.length === 0) {
						return;
					}

					// Check if any declaration is in the current file
					const hasLocalDeclaration = declarations.some(
						(declaration) => declaration.getSourceFile() === context.sourceFile,
					);

					if (hasLocalDeclaration) {
						return;
					}

					// Check if it's from a library file (global)
					const isGlobal = declarations.some((declaration) => {
						const sourceFile = declaration.getSourceFile();
						return (
							sourceFile.fileName.includes("lib.") &&
							sourceFile.isDeclarationFile
						);
					});

					if (!isGlobal) {
						return;
					}

					const newKeywordEnd = node.expression.getStart(context.sourceFile);

					context.report({
						data: { name },
						message: "noNewNonConstructor",
						range: getTSNodeRange(
							node.getChildAt(0, context.sourceFile),
							context.sourceFile,
						),
						suggestions: [
							{
								id: "removeNew",
								range: {
									begin: node.getStart(context.sourceFile),
									end: newKeywordEnd,
								},
								text: "",
							},
						],
					});
				},
			},
		};
	},
});
