import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const DEFAULT_AMBIGUOUS_WORDS = [
	"click here",
	"here",
	"link",
	"a link",
	"learn more",
];

function normalizeText(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[,.?¿!‽¡;:]/g, "")
		.replace(/\s+/g, " ");
}

function getTextContent(
	element: ts.JsxElement | ts.JsxSelfClosingElement,
	sourceFile: ts.SourceFile,
): string {
	const openingElement = ts.isJsxElement(element)
		? element.openingElement
		: element;

	const ariaLabel = openingElement.attributes.properties.find(
		(property) =>
			ts.isJsxAttribute(property) &&
			ts.isIdentifier(property.name) &&
			property.name.text === "aria-label",
	);

	if (ariaLabel && ts.isJsxAttribute(ariaLabel) && ariaLabel.initializer) {
		if (ts.isStringLiteral(ariaLabel.initializer)) {
			return ariaLabel.initializer.text;
		}
		if (
			ts.isJsxExpression(ariaLabel.initializer) &&
			ariaLabel.initializer.expression &&
			ts.isStringLiteral(ariaLabel.initializer.expression)
		) {
			return ariaLabel.initializer.expression.text;
		}
	}

	if (ts.isJsxSelfClosingElement(element)) {
		if (ts.isIdentifier(element.tagName) && element.tagName.text === "img") {
			const altAttr = element.attributes.properties.find(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "alt",
			);

			if (altAttr && ts.isJsxAttribute(altAttr) && altAttr.initializer) {
				if (ts.isStringLiteral(altAttr.initializer)) {
					return altAttr.initializer.text;
				}
				if (
					ts.isJsxExpression(altAttr.initializer) &&
					altAttr.initializer.expression &&
					ts.isStringLiteral(altAttr.initializer.expression)
				) {
					return altAttr.initializer.expression.text;
				}
			}
		}

		return "";
	}

	return extractTextFromChildren(element.children, sourceFile);
}

function extractTextFromChildren(
	children: ts.NodeArray<ts.JsxChild>,
	sourceFile: ts.SourceFile,
): string {
	let text = "";

	for (const child of children) {
		if (ts.isJsxText(child)) {
			text += child.text;
		} else if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) {
			const element = ts.isJsxElement(child) ? child.openingElement : child;

			const isAriaHidden = element.attributes.properties.some(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "aria-hidden",
			);

			if (!isAriaHidden) {
				text += " " + getTextContent(child, sourceFile);
			}
		}
	}

	return text;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports anchor elements with ambiguous text like 'click here' or 'learn more'.",
		id: "anchorAmbiguousText",
		preset: "logical",
	},
	messages: {
		ambiguousAnchorText: {
			primary: "Prefer descriptive anchor text over '{{ text }}'.",
			secondary: [
				"Screen readers announce elements as links, so ambiguous descriptions like 'click here' or 'learn more' do not provide sufficient context.",
				"Use descriptive text that clearly indicates where the link leads or what action it performs.",
				"This improves accessibility for all users, especially those using assistive technologies.",
			],
			suggestions: [
				"Replace with descriptive text that indicates the link destination",
				"Integrate the link naturally into surrounding text",
			],
		},
	},
	setup(context) {
		function checkAnchorElement(
			node: ts.JsxElement | ts.JsxSelfClosingElement,
		) {
			const element = ts.isJsxElement(node) ? node.openingElement : node;

			if (!ts.isIdentifier(element.tagName) || element.tagName.text !== "a") {
				return;
			}

			const textContent = getTextContent(node, context.sourceFile);
			const normalizedText = normalizeText(textContent);

			if (DEFAULT_AMBIGUOUS_WORDS.includes(normalizedText)) {
				const reportRange = ts.isJsxElement(node)
					? getTSNodeRange(node.openingElement.tagName, context.sourceFile)
					: getTSNodeRange(node.tagName, context.sourceFile);

				context.report({
					data: { text: normalizedText },
					message: "ambiguousAnchorText",
					range: reportRange,
				});
			}
		}

		return {
			visitors: {
				JsxElement: checkAnchorElement,
				JsxSelfClosingElement: checkAnchorElement,
			},
		};
	},
});
