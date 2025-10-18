import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

// Elements that don't support ARIA roles, states, or properties
const unsupportedElements = new Set([
	"base",
	"body",
	"caption",
	"col",
	"colgroup",
	"datalist",
	"dd",
	"details",
	"dialog",
	"dt",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"frame",
	"frameset",
	"head",
	"header",
	"hgroup",
	"html",
	"iframe",
	"legend",
	"link",
	"main",
	"meta",
	"meter",
	"nav",
	"noscript",
	"optgroup",
	"option",
	"output",
	"param",
	"picture",
	"progress",
	"script",
	"slot",
	"style",
	"template",
	"textarea",
	"title",
	"track",
]);

export default typescriptLanguage.createRule({
	about: {
		description: "Reports ARIA attributes on elements that don't support them.",
		id: "ariaUnsupportedElements",
		preset: "logical",
	},
	messages: {
		unsupportedElement: {
			primary:
				"The `{{ element }}` element does not support ARIA roles, states, or properties.",
			secondary: [
				"Certain reserved DOM elements do not support ARIA attributes.",
				"These elements are often not visible or have specific semantic meaning.",
				"This is required for WCAG 4.1.2 compliance.",
			],
			suggestions: ["Remove ARIA attributes from this element"],
		},
	},
	setup(context) {
		function checkElement(
			tagName: ts.JsxTagNameExpression,
			attributes: ts.JsxAttributes,
		) {
			if (!ts.isIdentifier(tagName)) {
				return;
			}

			const elementName = tagName.text.toLowerCase();
			if (!unsupportedElements.has(elementName)) {
				return;
			}

			// Check if element has any aria-* attributes or role attribute
			const hasAriaOrRole = attributes.properties.some((attr) => {
				if (!ts.isJsxAttribute(attr) || !ts.isIdentifier(attr.name)) {
					return false;
				}

				const attrName = attr.name.text.toLowerCase();
				return attrName === "role" || attrName.startsWith("aria-");
			});

			if (hasAriaOrRole) {
				context.report({
					data: { element: elementName },
					message: "unsupportedElement",
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
