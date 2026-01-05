import {
	getTSNodeRange,
	isGlobalDeclaration,
	typescriptLanguage,
} from "@flint.fyi/ts";
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
				CallExpression(node: ts.CallExpression, { sourceFile, typeChecker }) {
					if (
						ts.isPropertyAccessExpression(node.expression) &&
						ts.isIdentifier(node.expression.name) &&
						legacyMethods.has(node.expression.name.text) &&
						isGlobalDeclaration(node.expression.name, typeChecker) &&
						methodReplacements[node.expression.name.text]
					) {
						context.report({
							data: {
								method: node.expression.name.text,
								replacement:
									methodReplacements[node.expression.name.text] ?? "",
							},
							message: "preferQuerySelector",
							range: getTSNodeRange(node.expression.name, sourceFile),
						});
					}
				},
			},
		};
	},
});
