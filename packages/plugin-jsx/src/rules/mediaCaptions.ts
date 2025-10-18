import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports media elements without captions.",
		id: "mediaCaptions",
		preset: "logical",
	},
	messages: {
		missingCaptions: {
			primary: "Media elements must have captions via a <track> element.",
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
		function checkMediaElement(node: ts.JsxElement | ts.JsxSelfClosingElement) {
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

			// Check if media has muted attribute
			const hasMuted = attributes.properties.some(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "muted",
			);

			if (hasMuted) {
				return; // Muted media doesn't need captions
			}

			// Check if media has track children with kind="captions"
			if (ts.isJsxElement(node)) {
				const hasCaption = node.children.some((child) => {
					if (!ts.isJsxElement(child) && !ts.isJsxSelfClosingElement(child)) {
						return false;
					}

					const childTagName = ts.isJsxElement(child)
						? child.openingElement.tagName
						: child.tagName;

					if (!ts.isIdentifier(childTagName) || childTagName.text !== "track") {
						return false;
					}

					// Check if track has kind="captions"
					const childAttrs = ts.isJsxElement(child)
						? child.openingElement.attributes
						: child.attributes;

					return childAttrs.properties.some((attr) => {
						if (!ts.isJsxAttribute(attr) || !ts.isIdentifier(attr.name)) {
							return false;
						}

						if (attr.name.text !== "kind") {
							return false;
						}

						// Check if kind value is "captions"
						if (attr.initializer && ts.isStringLiteral(attr.initializer)) {
							return attr.initializer.text === "captions";
						}

						return false;
					});
				});

				if (hasCaption) {
					return;
				}
			}

			// Report missing captions
			context.report({
				message: "missingCaptions",
				range: getTSNodeRange(tagName, context.sourceFile),
			});
		}

		return {
			visitors: {
				JsxElement(node: ts.JsxElement) {
					checkMediaElement(node);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkMediaElement(node);
				},
			},
		};
	},
});
