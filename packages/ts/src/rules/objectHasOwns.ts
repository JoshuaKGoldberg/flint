import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer Object.hasOwn() over Object.prototype.hasOwnProperty.call() for checking own properties.",
		id: "objectHasOwns",
		preset: "stylistic",
	},
	messages: {
		preferHasOwn: {
			primary: "Prefer Object.hasOwn() over hasOwnProperty() calls.",
			secondary: [
				"Object.hasOwn() is a more modern and safer way to check if an object has its own property.",
				"It avoids issues with objects that don't inherit from Object.prototype or have a modified hasOwnProperty property.",
				"Object.hasOwn() was introduced in ES2022 and is more concise than the hasOwnProperty alternatives.",
			],
			suggestions: [
				"Use Object.hasOwn(obj, key) instead of obj.hasOwnProperty(key).",
				"Use Object.hasOwn(obj, key) instead of Object.prototype.hasOwnProperty.call(obj, key).",
				"Use Object.hasOwn(obj, key) instead of {}.hasOwnProperty.call(obj, key).",
			],
		},
	},
	setup(context) {
		function isObjectPrototypeHasOwnProperty(node: ts.Expression): boolean {
			// Check for Object.prototype.hasOwnProperty
			if (
				ts.isPropertyAccessExpression(node) &&
				ts.isIdentifier(node.name) &&
				node.name.text === "hasOwnProperty" &&
				ts.isPropertyAccessExpression(node.expression) &&
				ts.isIdentifier(node.expression.name) &&
				node.expression.name.text === "prototype" &&
				ts.isIdentifier(node.expression.expression) &&
				node.expression.expression.text === "Object"
			) {
				return true;
			}

			// Check for {}.hasOwnProperty
			if (
				ts.isPropertyAccessExpression(node) &&
				ts.isIdentifier(node.name) &&
				node.name.text === "hasOwnProperty" &&
				ts.isObjectLiteralExpression(node.expression) &&
				node.expression.properties.length === 0
			) {
				return true;
			}

			return false;
		}

		return {
			visitors: {
				CallExpression: (node) => {
					// Check for Object.prototype.hasOwnProperty.call(obj, key) or {}.hasOwnProperty.call(obj, key)
					if (
						ts.isPropertyAccessExpression(node.expression) &&
						ts.isIdentifier(node.expression.name) &&
						node.expression.name.text === "call" &&
						isObjectPrototypeHasOwnProperty(node.expression.expression) &&
						node.arguments.length >= 2
					) {
						context.report({
							message: "preferHasOwn",
							range: {
								begin: node.getStart(context.sourceFile),
								end: node.getEnd(),
							},
						});
						return;
					}

					// Check for obj.hasOwnProperty(key)
					if (
						ts.isPropertyAccessExpression(node.expression) &&
						ts.isIdentifier(node.expression.name) &&
						node.expression.name.text === "hasOwnProperty" &&
						node.arguments.length >= 1
					) {
						// Make sure it's not Object.prototype.hasOwnProperty or {}.hasOwnProperty
						if (!isObjectPrototypeHasOwnProperty(node.expression)) {
							context.report({
								message: "preferHasOwn",
								range: {
									begin: node.getStart(context.sourceFile),
									end: node.getEnd(),
								},
							});
						}
					}
				},
			},
		};
	},
});
