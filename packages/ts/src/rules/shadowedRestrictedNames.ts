import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";

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
			primary: "This variable misleadingly shadows the global `{{ name }}`.",
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
		function checkIdentifier(
			node: ts.Identifier,
			sourceFile: ts.SourceFile,
		): void {
			if (restrictedNames.has(node.text)) {
				context.report({
					data: {
						name: node.text,
					},
					message: "shadowedRestrictedName",
					range: getTSNodeRange(node, sourceFile),
				});
			}
		}

		function checkBindingName(
			name: ts.BindingName,
			sourceFile: ts.SourceFile,
		): void {
			if (ts.isIdentifier(name)) {
				checkIdentifier(name, sourceFile);
			} else if (
				ts.isObjectBindingPattern(name) ||
				ts.isArrayBindingPattern(name)
			) {
				for (const element of name.elements) {
					if (ts.isBindingElement(element)) {
						checkBindingName(element.name, sourceFile);
					}
				}
			}
		}

		function checkParameters(
			parameters: ts.NodeArray<ts.ParameterDeclaration>,
			sourceFile: ts.SourceFile,
		): void {
			for (const parameter of parameters) {
				checkBindingName(parameter.name, sourceFile);
			}
		}

		return {
			visitors: {
				ArrowFunction: (node, { sourceFile }) => {
					checkParameters(node.parameters, sourceFile);
				},
				ClassDeclaration: (node, { sourceFile }) => {
					if (node.name) {
						checkIdentifier(node.name, sourceFile);
					}
				},
				ClassExpression: (node, { sourceFile }) => {
					if (node.name) {
						checkIdentifier(node.name, sourceFile);
					}
				},
				FunctionDeclaration: (node, { sourceFile }) => {
					if (node.name) {
						checkIdentifier(node.name, sourceFile);
					}
					checkParameters(node.parameters, sourceFile);
				},
				FunctionExpression: (node, { sourceFile }) => {
					if (node.name) {
						checkIdentifier(node.name, sourceFile);
					}
					checkParameters(node.parameters, sourceFile);
				},
				MethodDeclaration: (node, { sourceFile }) => {
					checkParameters(node.parameters, sourceFile);
				},
				VariableDeclaration: (node, { sourceFile }) => {
					checkBindingName(node.name, sourceFile);
				},
			},
		};
	},
});
