import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const keyboardEvents = ["onKeyDown", "onKeyPress", "onKeyUp"];
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
				"`onClick` must be accompanied by at least one of: `onKeyUp`, `onKeyDown`, `onKeyPress`.",
			secondary: [
				"Click events should have keyboard equivalents for users who cannot use a mouse.",
				"This is important for users with physical disabilities and screen reader users.",
				"Required for WCAG 2.1.1 compliance.",
			],
			suggestions: [
				"Add onKeyDown, onKeyUp, or onKeyPress handler",
				"Use a button element which is inherently keyboard accessible",
			],
		},
	},
	setup(context) {
		function checkClickEvent(
			tagName: ts.JsxTagNameExpression,
			attributes: ts.JsxAttributes,
		) {
			// Skip interactive elements (they're already keyboard accessible)
			if (ts.isIdentifier(tagName)) {
				const elementName = tagName.text.toLowerCase();
				if (interactiveElements.has(elementName)) {
					return;
				}
			}

			// Check if element has aria-hidden
			const hasAriaHidden = attributes.properties.some((attr) => {
				if (!ts.isJsxAttribute(attr) || !ts.isIdentifier(attr.name)) {
					return false;
				}
				return attr.name.text === "aria-hidden";
			});

			if (hasAriaHidden) {
				return; // Hidden elements don't need keyboard handlers
			}

			// Check if element has onClick
			const hasOnClick = attributes.properties.some(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "onClick",
			);

			if (!hasOnClick) {
				return;
			}

			// Check if element has keyboard event handler
			const hasKeyboardEvent = attributes.properties.some((attr) => {
				if (!ts.isJsxAttribute(attr) || !ts.isIdentifier(attr.name)) {
					return false;
				}
				return keyboardEvents.includes(attr.name.text);
			});

			if (!hasKeyboardEvent) {
				const onClickAttr = attributes.properties.find(
					(attr) =>
						ts.isJsxAttribute(attr) &&
						ts.isIdentifier(attr.name) &&
						attr.name.text === "onClick",
				);

				if (onClickAttr) {
					context.report({
						message: "missingKeyEvent",
						range: getTSNodeRange(onClickAttr, context.sourceFile),
					});
				}
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkClickEvent(node.tagName, node.attributes);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkClickEvent(node.tagName, node.attributes);
				},
			},
		};
	},
});
