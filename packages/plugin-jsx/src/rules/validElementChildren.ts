import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const voidElements = new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports void DOM elements that have children, which is invalid HTML.",
		id: "validElementChildren",
		preset: "logical",
	},
	messages: {
		voidElementWithChildren: {
			primary:
				"The <{{ element }}> element is a void element and cannot have children.",
			secondary: [
				"Void elements are self-closing and cannot contain any content or children.",
				"Remove the children or use a different element type.",
				"This violates HTML specification and may cause rendering issues.",
			],
			suggestions: [
				"Remove the children from the element",
				"Use a self-closing syntax: <{{ element }} />",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				JsxElement(node: ts.JsxElement) {
					const openingElement = node.openingElement;
					if (!ts.isIdentifier(openingElement.tagName)) {
						return;
					}

					const elementName = openingElement.tagName.text.toLowerCase();
					if (!voidElements.has(elementName)) {
						return;
					}

					if (node.children.length > 0) {
						context.report({
							data: { element: elementName },
							message: "voidElementWithChildren",
							range: getTSNodeRange(openingElement.tagName, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
