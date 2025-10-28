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

const nonInteractiveElements = new Set([
	"area",
	"article",
	"aside",
	"body",
	"br",
	"details",
	"div",
	"footer",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"header",
	"hr",
	"img",
	"li",
	"main",
	"nav",
	"ol",
	"p",
	"section",
	"span",
	"table",
	"td",
	"ul",
]);

const nonInteractiveRoles = new Set([
	"article",
	"banner",
	"complementary",
	"img",
	"listitem",
	"main",
	"navigation",
	"region",
	"tooltip",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports non-interactive elements with interactive event handlers.",
		id: "nonInteractiveElementInteractions",
		preset: "logical",
	},
	messages: {
		invalidHandler: {
			primary:
				"Non-interactive element <{{ element }}> should not have interactive event handlers.",
			secondary: [
				"Non-interactive elements indicate content and containers in the user interface.",
				"Use native interactive elements like <button> or <a> instead, or add an interactive role.",
				"This is required for WCAG 4.1.2 compliance.",
			],
			suggestions: [
				"Use a native interactive element instead (e.g. <button>)",
				"Add an interactive role attribute (e.g. role='button')",
				"Move the handler to an inner element with an interactive role",
			],
		},
	},
	setup(context) {
		function checkElement(
			element: ts.JsxOpeningElement | ts.JsxSelfClosingElement,
		) {
			if (!ts.isIdentifier(element.tagName)) {
				return;
			}

			const elementName = element.tagName.text.toLowerCase();
			if (
				elementName !== element.tagName.text ||
				!nonInteractiveElements.has(elementName)
			) {
				return;
			}

			let hasInteractiveHandler = false;
			let hasInteractiveRole = false;

			for (const property of element.attributes.properties) {
				if (ts.isJsxAttribute(property) && ts.isIdentifier(property.name)) {
					if (property.name.text === "role") {
						if (
							property.initializer &&
							ts.isStringLiteral(property.initializer)
						) {
							const role = property.initializer.text;
							if (!nonInteractiveRoles.has(role)) {
								hasInteractiveRole = true;
							}
						}
					}

					if (interactiveHandlers.includes(property.name.text)) {
						hasInteractiveHandler = true;
					}
				}
			}

			if (hasInteractiveHandler && !hasInteractiveRole) {
				context.report({
					data: { element: elementName },
					message: "invalidHandler",
					range: getTSNodeRange(element.tagName, context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkElement(node);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkElement(node);
				},
			},
		};
	},
});
