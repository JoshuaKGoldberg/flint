import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const legacyMethods = new Set([
	"getElementById",
	"getElementsByClassName",
	"getElementsByTagName",
	"getElementsByTagNameNS",
]);

const methodReplacements: Record<string, string> = {
	getElementById: "querySelector",
	getElementsByClassName: "querySelectorAll",
	getElementsByTagName: "querySelectorAll",
	getElementsByTagNameNS: "querySelectorAll",
};

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer modern `querySelector` and `querySelectorAll` over legacy DOM query methods.",
		id: "nodeQueryMethods",
		preset: "stylistic",
	},
	messages: {
		preferQuerySelector: {
			primary:
				"Prefer `{{ replacement }}()` over the legacy `{{ method }}()` method.",
			secondary: [
				"The querySelector and querySelectorAll methods provide a more consistent and powerful API for querying DOM elements.",
				"They use CSS selectors which are more flexible and widely understood than the older getElementById/getElementsBy* methods.",
			],
			suggestions: [
				"Use {{ replacement }}() with an appropriate CSS selector.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node: ts.CallExpression) {
					if (!ts.isPropertyAccessExpression(node.expression)) {
						return;
					}

					const { name } = node.expression;
					if (!ts.isIdentifier(name) || !legacyMethods.has(name.text)) {
						return;
					}

					// Check if this is a call on document or an element
					// We want to flag document.getElementById, element.getElementsByClassName, etc.
					// But not if someone has defined their own local function with the same name
					const typeChecker = context.typeChecker;
					const symbol = typeChecker.getSymbolAtLocation(name);
					if (!symbol) {
						return;
					}

					const declarations = symbol.getDeclarations();
					if (!declarations || declarations.length === 0) {
						return;
					}

					// Check if this method comes from the DOM lib (document or HTMLElement)
					const declaration = declarations[0];
					const sourceFile = declaration.getSourceFile();
					if (!sourceFile.fileName.includes("lib.dom.d.ts")) {
						return;
					}

					const method = name.text;
					const replacement = methodReplacements[method];

					context.report({
						data: { method, replacement },
						message: "preferQuerySelector",
						range: getTSNodeRange(name, context.sourceFile),
					});
				},
			},
		};
	},
});
