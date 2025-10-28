import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const validButtonTypes = new Set(["button", "reset", "submit"]);

export default typescriptLanguage.createRule({
	about: {
		description: "Reports button elements without an explicit type attribute.",
		id: "buttonTypes",
		preset: "logical",
	},
	messages: {
		invalidType: {
			primary:
				"Button type '{{ type }}' is invalid. Use 'button', 'submit', or 'reset'.",
			secondary: [
				"The type attribute must be one of: 'button', 'submit', or 'reset'.",
				"Invalid types will not behave as expected in all browsers.",
			],
			suggestions: [
				"Change to type='button' for general action buttons",
				"Change to type='submit' for form submission buttons",
				"Change to type='reset' for form reset buttons",
			],
		},
		missingType: {
			primary: "Button elements should have an explicit type attribute.",
			secondary: [
				"Buttons without an explicit type default to 'submit', which can cause unintended form submissions.",
				"Valid button types are 'button', 'submit', and 'reset'.",
				"Specify an explicit type to make the button's behavior clear.",
			],
			suggestions: [
				"Add type='button' for general action buttons",
				"Add type='submit' for form submission buttons",
				"Add type='reset' for form reset buttons",
			],
		},
	},
	setup(context) {
		function checkElement(node: ts.JsxOpeningLikeElement) {
			if (!ts.isIdentifier(node.tagName)) {
				return;
			}

			const elementName = node.tagName.text.toLowerCase();

			if (elementName !== "button") {
				return;
			}

			let typeAttribute: ts.JsxAttribute | undefined;

			for (const property of node.attributes.properties) {
				if (
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text.toLowerCase() === "type"
				) {
					typeAttribute = property;
					break;
				}
			}

			if (!typeAttribute) {
				context.report({
					message: "missingType",
					range: getTSNodeRange(node.tagName, context.sourceFile),
				});
				return;
			}

			const typeValue = getTypeValue(typeAttribute);

			if (typeValue !== undefined && !validButtonTypes.has(typeValue)) {
				context.report({
					data: { type: typeValue },
					message: "invalidType",
					range: getTSNodeRange(typeAttribute, context.sourceFile),
				});
			}
		}

		function getTypeValue(attribute: ts.JsxAttribute): string | undefined {
			if (!attribute.initializer) {
				return undefined;
			}

			if (ts.isStringLiteral(attribute.initializer)) {
				return attribute.initializer.text;
			}

			if (ts.isJsxExpression(attribute.initializer)) {
				const expr = attribute.initializer.expression;
				if (expr && ts.isStringLiteral(expr)) {
					return expr.text;
				}
			}

			return undefined;
		}

		return {
			visitors: {
				JsxOpeningElement: checkElement,
				JsxSelfClosingElement: checkElement,
			},
		};
	},
});
