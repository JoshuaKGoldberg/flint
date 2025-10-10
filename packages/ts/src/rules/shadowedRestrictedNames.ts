import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

const restrictedNames = new Set([
	"undefined",
	"NaN",
	"Infinity",
	"arguments",
	"eval",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports variable declarations that shadow JavaScript's restricted names.",
		id: "shadowedRestrictedNames",
		preset: "untyped",
	},
	messages: {
		shadowedRestrictedName: {
			primary:
				"Avoid shadowing restricted names like undefined, NaN, Infinity, arguments, and eval.",
			secondary: [
				"JavaScript has certain built-in global identifiers that are considered restricted because shadowing them can lead to confusing or erroneous code.",
				"When you declare a variable with a restricted name, it shadows the global identifier and can cause unexpected behavior.",
			],
			suggestions: [
				"Use a different variable name that doesn't shadow a restricted name.",
			],
		},
	},
	setup(context) {
		function checkIdentifier(node: ts.Identifier): void {
			if (restrictedNames.has(node.text)) {
				context.report({
					message: "shadowedRestrictedName",
					range: {
						begin: node.getStart(context.sourceFile),
						end: node.getEnd(),
					},
				});
			}
		}

		function checkBindingName(name: ts.BindingName): void {
			if (ts.isIdentifier(name)) {
				checkIdentifier(name);
			} else if (
				ts.isObjectBindingPattern(name) ||
				ts.isArrayBindingPattern(name)
			) {
				for (const element of name.elements) {
					if (ts.isBindingElement(element)) {
						checkBindingName(element.name);
					}
				}
			}
		}

		return {
			visitors: {
				VariableDeclaration: (node) => {
					checkBindingName(node.name);
				},
				Parameter: (node) => {
					checkBindingName(node.name);
				},
				FunctionDeclaration: (node) => {
					if (node.name) {
						checkIdentifier(node.name);
					}
				},
				FunctionExpression: (node) => {
					if (node.name) {
						checkIdentifier(node.name);
					}
				},
				ClassDeclaration: (node) => {
					if (node.name) {
						checkIdentifier(node.name);
					}
				},
				ClassExpression: (node) => {
					if (node.name) {
						checkIdentifier(node.name);
					}
				},
			},
		};
	},
});
