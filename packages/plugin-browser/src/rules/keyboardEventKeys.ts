import {
	getDeclarationsIfGlobal,
	getTSNodeRange,
	typescriptLanguage,
} from "@flint.fyi/ts";
import * as ts from "typescript";

const deprecatedProperties = new Set(["charCode", "keyCode", "which"]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer KeyboardEvent.key over deprecated properties like keyCode, charCode, and which.",
		id: "keyboardEventKeys",
		preset: "logical",
	},
	messages: {
		preferKey: {
			primary:
				"Prefer `KeyboardEvent.key` over the deprecated `{{ property }}` property.",
			secondary: [
				"The `{{ property }}` property is deprecated and less semantic than the `.key` property.",
				"The `.key` property provides a string representation of the key pressed, making code more readable and maintainable.",
			],
			suggestions: ["Replace with `.key` property access."],
		},
	},
	setup(context) {
		function isKeyboardEvent(expression: ts.LeftHandSideExpression) {
			return (
				context.typeChecker.getTypeAtLocation(expression).getSymbol()?.name ===
				"KeyboardEvent"
			);
		}

		function isKeyboardEventProperty(name: ts.Identifier) {
			const declarations = getDeclarationsIfGlobal(name, context.typeChecker);
			if (!declarations) {
				return;
			}

			return (
				declarations.length === 1 &&
				ts.isInterfaceDeclaration(declarations[0].parent) &&
				["KeyboardEvent", "UIEvent"].includes(declarations[0].parent.name.text)
			);
		}

		return {
			visitors: {
				PropertyAccessExpression(node: ts.PropertyAccessExpression) {
					if (!ts.isIdentifier(node.name)) {
						return;
					}

					const property = node.name.text;
					if (
						!deprecatedProperties.has(property) ||
						!isKeyboardEvent(node.expression) ||
						!isKeyboardEventProperty(node.name)
					) {
						return;
					}

					context.report({
						data: { property },
						message: "preferKey",
						range: getTSNodeRange(node.name, context.sourceFile),
					});
				},
			},
		};
	},
});
