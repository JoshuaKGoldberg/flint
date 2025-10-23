import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

const restrictedNames = new Set([
	"arguments",
	"eval",
	"Infinity",
	"NaN",
	"undefined",
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
			primary: "This variable misleadingly shadows the global {{ name }}.",
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
					data: {
						name: node.text,
					},
					message: "shadowedRestrictedName",
					range: getTSNodeRange(node, context.sourceFile),
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

		function checkParameters(
			parameters: ts.NodeArray<ts.ParameterDeclaration>,
		): void {
			for (const parameter of parameters) {
				checkBindingName(parameter.name);
			}
		}

		return {
			visitors: {
				ArrowFunction: (node) => {
					checkParameters(node.parameters);
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
				FunctionDeclaration: (node) => {
					if (node.name) {
						checkIdentifier(node.name);
					}
					checkParameters(node.parameters);
				},
				FunctionExpression: (node) => {
					if (node.name) {
						checkIdentifier(node.name);
					}
					checkParameters(node.parameters);
				},
				MethodDeclaration: (node) => {
					checkParameters(node.parameters);
				},
				VariableDeclaration: (node) => {
					checkBindingName(node.name);
				},
			},
		};
	},
});
