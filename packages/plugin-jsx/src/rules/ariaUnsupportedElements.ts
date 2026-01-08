import {
	getTSNodeRange,
	type TypeScriptFileServices,
	typescriptLanguage,
} from "@flint.fyi/ts";
import * as ts from "typescript";

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
			node: ts.JsxOpeningLikeElement,
			{ sourceFile }: TypeScriptFileServices,
		) {
			if (!ts.isIdentifier(node.tagName)) {
				return;
			}

			const elementName = node.tagName.text.toLowerCase();
			if (!unsupportedElements.has(elementName)) {
				return;
			}

			if (
				node.attributes.properties.some((property) => {
					if (!ts.isJsxAttribute(property) || !ts.isIdentifier(property.name)) {
						return false;
					}

					const attributeName = property.name.text.toLowerCase();
					return attributeName === "role" || attributeName.startsWith("aria-");
				})
			) {
				context.report({
					data: { element: elementName },
					message: "unsupportedElement",
					range: getTSNodeRange(node.tagName, sourceFile),
				});
			}
		}

		return {
			visitors: {
				JsxOpeningElement: checkElement,
				JsxSelfClosingElement: checkElement,
			},
		};
	},
});
