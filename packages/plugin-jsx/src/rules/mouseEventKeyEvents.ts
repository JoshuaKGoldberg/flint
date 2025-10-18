import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const mouseToKeyboardMap: Record<string, string> = {
	onMouseOut: "onBlur",
	onMouseOver: "onFocus",
};

export default typescriptLanguage.createRule({
	about: {
		description: "Reports mouse events without corresponding keyboard events.",
		id: "mouseEventKeyEvents",
		preset: "logical",
	},
	messages: {
		missingKeyEvent: {
			primary:
				"`{{ mouseEvent }}` must be accompanied by `{{ keyEvent }}` for keyboard accessibility.",
			secondary: [
				"Mouse events should have keyboard equivalents for users who cannot use a mouse.",
				"This is important for users with physical disabilities and screen reader users.",
				"Required for WCAG 2.1.1 compliance.",
			],
			suggestions: [
				"Add the corresponding keyboard event handler",
				"Ensure both mouse and keyboard users can access the functionality",
			],
		},
	},
	setup(context) {
		function checkMouseEvents(attributes: ts.JsxAttributes) {
			const presentAttributes = new Set<string>();

			// Collect all present attributes
			for (const attr of attributes.properties) {
				if (ts.isJsxAttribute(attr) && ts.isIdentifier(attr.name)) {
					presentAttributes.add(attr.name.text);
				}
			}

			// Check each mouse event for its keyboard equivalent
			for (const attr of attributes.properties) {
				if (!ts.isJsxAttribute(attr) || !ts.isIdentifier(attr.name)) {
					continue;
				}

				const attrName = attr.name.text;
				const requiredKeyEvent = mouseToKeyboardMap[attrName];

				if (requiredKeyEvent && !presentAttributes.has(requiredKeyEvent)) {
					context.report({
						data: { keyEvent: requiredKeyEvent, mouseEvent: attrName },
						message: "missingKeyEvent",
						range: getTSNodeRange(attr, context.sourceFile),
					});
				}
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkMouseEvents(node.attributes);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkMouseEvents(node.attributes);
				},
			},
		};
	},
});
