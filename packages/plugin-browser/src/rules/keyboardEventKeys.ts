import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
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
		return {
			visitors: {
				PropertyAccessExpression(node: ts.PropertyAccessExpression) {
					if (!ts.isIdentifier(node.name)) {
						return;
					}

					const propertyName = node.name.text;
					if (!deprecatedProperties.has(propertyName)) {
						return;
					}

					const type = context.typeChecker.getTypeAtLocation(node.expression);
					const symbol = type.getSymbol();
					if (!symbol) {
						return;
					}

					// Check if the type is KeyboardEvent or has KeyboardEvent in its heritage
					const typeName = context.typeChecker.typeToString(type);
					if (
						!typeName.includes("KeyboardEvent") &&
						symbol.getName() !== "KeyboardEvent"
					) {
						return;
					}

					context.report({
						data: { property: propertyName },
						message: "preferKey",
						range: getTSNodeRange(node.name, context.sourceFile),
					});
				},
			},
		};
	},
});
