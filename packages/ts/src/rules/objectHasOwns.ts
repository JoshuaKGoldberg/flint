import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";
import { isGlobalDeclarationOfName } from "../utils/isGlobalDeclarationOfName.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer Object.hasOwn() over Object.prototype.hasOwnProperty.call() for checking own properties.",
		id: "objectHasOwns",
		preset: "stylistic",
	},
	messages: {
		preferHasOwn: {
			primary:
				"`hasOwnProperty()` calls can fail on objects without `Object.prototype` or with overridden properties.",
			secondary: [
				"`Object.hasOwn()` is a more modern and safer way to check if an object has its own property.",
				"It avoids issues with objects that don't inherit from `Object.prototype` or have a modified hasOwnProperty property.",
				"`Object.hasOwn()` was introduced in ES2022 and is more concise than the hasOwnProperty alternatives.",
			],
			suggestions: [
				"Use the safer, more modern `Object.hasOwn(obj, key)`.",
				"Use an alternative key check such as the `in` operator.",
			],
		},
	},
	setup(context) {
		function isObjectPrototypeHasOwnProperty(
			node: ts.Expression,
			typeChecker: ts.TypeChecker,
		) {
			return (
				ts.isPropertyAccessExpression(node) &&
				ts.isIdentifier(node.name) &&
				node.name.text === "prototype" &&
				ts.isIdentifier(node.expression) &&
				isGlobalDeclarationOfName(node.expression, "Object", typeChecker)
			);
		}

		function isObjectLiteralHasOwnProperty(node: ts.Expression) {
			return ts.isObjectLiteralExpression(node) && node.properties.length === 0;
		}

		function isHasOwnProperty(
			node: ts.Expression,
			typeChecker: ts.TypeChecker,
		): boolean {
			if (
				!ts.isPropertyAccessExpression(node) ||
				!ts.isIdentifier(node.name) ||
				node.name.text !== "hasOwnProperty"
			) {
				return false;
			}

			return (
				isObjectPrototypeHasOwnProperty(node.expression, typeChecker) ||
				isObjectLiteralHasOwnProperty(node.expression)
			);
		}

		return {
			visitors: {
				CallExpression: (node, { sourceFile, typeChecker }) => {
					if (
						!ts.isPropertyAccessExpression(node.expression) ||
						!ts.isIdentifier(node.expression.name)
					) {
						return;
					}

					if (
						node.expression.name.text === "call" &&
						node.arguments.length >= 2 &&
						isHasOwnProperty(node.expression.expression, typeChecker)
					) {
						context.report({
							message: "preferHasOwn",
							range: getTSNodeRange(node, sourceFile),
						});
						return;
					}

					if (
						node.expression.name.text === "hasOwnProperty" &&
						node.arguments.length >= 1 &&
						!isHasOwnProperty(node.expression, typeChecker)
					) {
						context.report({
							message: "preferHasOwn",
							range: getTSNodeRange(node, sourceFile),
						});
					}
				},
			},
		};
	},
});
