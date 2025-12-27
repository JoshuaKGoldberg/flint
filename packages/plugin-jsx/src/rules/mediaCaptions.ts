import {
	getTSNodeRange,
	typescriptLanguage,
	TypeScriptServices,
} from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports media elements without captions.",
		id: "mediaCaptions",
		preset: "logical",
	},
	messages: {
		missingCaptions: {
			primary: "This media element is missing <track> element captions.",
			secondary: [
				"Captions are essential for deaf users to follow along with media content.",
				"The <track> element with kind='captions' provides this accessibility feature.",
				"This is required for WCAG 1.2.2 and 1.2.3 compliance.",
			],
			suggestions: [
				'Add a <track kind="captions"> element as a child',
				"Add the muted attribute if the media has no audio",
			],
		},
	},
	setup(context) {
		function checkMediaElement(
			node: ts.JsxElement | ts.JsxSelfClosingElement,
			{ sourceFile }: TypeScriptServices,
		) {
			const tagName = ts.isJsxElement(node)
				? node.openingElement.tagName
				: node.tagName;

			if (!ts.isIdentifier(tagName)) {
				return;
			}

			const elementName = tagName.text.toLowerCase();
			if (elementName !== "audio" && elementName !== "video") {
				return;
			}

			const attributes = ts.isJsxElement(node)
				? node.openingElement.attributes
				: node.attributes;

			if (
				attributes.properties.some(
					(properties) =>
						ts.isJsxAttribute(properties) &&
						ts.isIdentifier(properties.name) &&
						properties.name.text === "muted",
				)
			) {
				return;
			}

			if (ts.isJsxElement(node) && node.children.some(isCaptionsTrack)) {
				return;
			}

			context.report({
				message: "missingCaptions",
				range: getTSNodeRange(tagName, sourceFile),
			});
		}

		return {
			visitors: {
				JsxElement: checkMediaElement,
				JsxSelfClosingElement: checkMediaElement,
			},
		};
	},
});

function isCaptionsTrack(node: ts.Node) {
	if (!ts.isJsxElement(node) && !ts.isJsxSelfClosingElement(node)) {
		return false;
	}

	const childTagName = ts.isJsxElement(node)
		? node.openingElement.tagName
		: node.tagName;

	if (!ts.isIdentifier(childTagName) || childTagName.text !== "track") {
		return false;
	}

	const childAttributes = ts.isJsxElement(node)
		? node.openingElement.attributes
		: node.attributes;

	return childAttributes.properties.some((property) => {
		if (
			!ts.isJsxAttribute(property) ||
			!ts.isIdentifier(property.name) ||
			property.name.text !== "kind"
		) {
			return false;
		}

		if (property.initializer && ts.isStringLiteral(property.initializer)) {
			return property.initializer.text === "captions";
		}

		return false;
	});
}
