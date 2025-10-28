import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const interactiveElements = new Set([
	"a",
	"button",
	"input",
	"select",
	"textarea",
]);

export default typescriptLanguage.createRule({
	about: {
		description: "Reports onClick without keyboard event handlers.",
		id: "clickEventKeyEvents",
		preset: "logical",
	},
	messages: {
		missingKeyEvent: {
			primary:
				"This `onClick` is missing accompanying `onKeyUp`, `onKeyDown`, and/or `onKeyPress` keyboard events.",
			secondary: [
				"Click events should have keyboard equivalents for users who cannot use a mouse.",
				"This is important for users with physical disabilities and screen reader users.",
				"Required for WCAG 2.1.1 compliance.",
			],
			suggestions: [
				"Add onKeyDown, onKeyUp, and/or onKeyPress handlers",
				"Use a button element which is inherently keyboard accessible",
			],
		},
	},
	setup(context) {
		function checkClickEvent(node: ts.JsxOpeningLikeElement) {
			if (
				!ts.isIdentifier(node.tagName) ||
				node.tagName.text.toLowerCase() !== node.tagName.text
			) {
				return;
			}

			const elementName = node.tagName.text.toLowerCase();
			if (interactiveElements.has(elementName)) {
				return;
			}

			let onClickProperty: ts.JsxAttributeLike | undefined;

			for (const property of node.attributes.properties) {
				if (ts.isJsxAttribute(property) && ts.isIdentifier(property.name)) {
					switch (property.name.text) {
						case "aria-hidden":
						case "onKeyDown":
						case "onKeyPress":
						case "onKeyUp":
							return;

						case "onClick":
							onClickProperty = property;
							break;
					}
				}
			}

			if (onClickProperty) {
				context.report({
					message: "missingKeyEvent",
					range: getTSNodeRange(onClickProperty, context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				JsxOpeningElement: checkClickEvent,
				JsxSelfClosingElement: checkClickEvent,
			},
		};
	},
});
