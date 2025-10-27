import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const interactiveHandlers = [
	"onClick",
	"onKeyDown",
	"onKeyPress",
	"onKeyUp",
	"onMouseDown",
	"onMouseUp",
];

const interactiveElements = new Set([
	"a",
	"button",
	"input",
	"select",
	"textarea",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports static elements with event handlers that lack ARIA roles.",
		id: "staticElementInteractions",
		preset: "logical",
	},
	messages: {
		missingRole: {
			primary:
				"Static elements with event handlers must have a role attribute.",
			secondary: [
				"Static HTML elements like <div> and <span> have no semantic meaning.",
				"Interactive handlers require a role to convey purpose to assistive technology.",
				"Required for WCAG 4.1.2 compliance.",
			],
			suggestions: [
				"Add a role attribute (e.g., role='button')",
				"Use a semantic HTML element instead (e.g., <button>)",
			],
		},
	},
	setup(context) {
		function checkElement(
			tagName: ts.JsxTagNameExpression,
			attributes: ts.JsxAttributes,
		) {
			// Skip non-identifier tags (e.g., member expressions)
			if (!ts.isIdentifier(tagName)) {
				return;
			}

			const elementName = tagName.text.toLowerCase();

			// Skip interactive elements
			if (interactiveElements.has(elementName)) {
				return;
			}

			// Check if element has event handlers
			const hasEventHandler = attributes.properties.some((attr) => {
				if (!ts.isJsxAttribute(attr) || !ts.isIdentifier(attr.name)) {
					return false;
				}
				return interactiveHandlers.includes(attr.name.text);
			});

			if (!hasEventHandler) {
				return;
			}

			// Check if element has role attribute
			const hasRole = attributes.properties.some(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "role",
			);

			if (!hasRole) {
				context.report({
					message: "missingRole",
					range: getTSNodeRange(tagName, context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkElement(node.tagName, node.attributes);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkElement(node.tagName, node.attributes);
				},
			},
		};
	},
});
