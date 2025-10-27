import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports invalid usage of anchor elements.",
		id: "anchorValidity",
		preset: "logical",
	},
	messages: {
		invalidHref: {
			primary: "Anchor has an invalid href value '{{ href }}'.",
			secondary: [
				"Anchors should navigate to valid URLs or page sections.",
				"Use a button element for click handlers without navigation.",
				"This is required for WCAG 2.4.4 compliance.",
			],
			suggestions: [
				"Use a valid URL or fragment identifier",
				"Use a <button> element instead",
			],
		},
		missingHref: {
			primary: "Anchor element is missing an href attribute.",
			secondary: [
				"Anchors without href are not keyboard accessible.",
				"Use a button element for actions without navigation.",
				"This is required for WCAG 4.1.2 compliance.",
			],
			suggestions: [
				"Add a valid href attribute",
				"Use a <button> element instead",
			],
		},
		shouldBeButton: {
			primary: "Anchor with onClick handler should be a button.",
			secondary: [
				"Interactive elements without valid href should use button elements.",
				"Buttons provide better semantics and keyboard accessibility.",
				"This is required for WCAG 4.1.2 compliance.",
			],
			suggestions: ["Replace <a> with <button>"],
		},
	},
	setup(context) {
		function getHrefValue(
			attributes: ts.JsxAttributes,
		): null | string | undefined {
			const hrefAttr = attributes.properties.find(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "href",
			);

			if (!hrefAttr || !ts.isJsxAttribute(hrefAttr)) {
				return undefined; // No href attribute
			}

			if (!hrefAttr.initializer) {
				return null; // href with no value
			}

			if (ts.isStringLiteral(hrefAttr.initializer)) {
				return hrefAttr.initializer.text;
			}

			// JSX expression - we can't determine the value
			return null;
		}

		function hasOnClick(attributes: ts.JsxAttributes): boolean {
			return attributes.properties.some(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "onClick",
			);
		}

		function isInvalidHref(href: string): boolean {
			return (
				href === "#" ||
				href === "javascript:void(0)" ||
				href === "javascript:void(0);" ||
				href.startsWith("javascript:")
			);
		}

		function checkAnchor(
			element: ts.JsxOpeningElement | ts.JsxSelfClosingElement,
		) {
			if (!ts.isIdentifier(element.tagName) || element.tagName.text !== "a") {
				return;
			}

			const href = getHrefValue(element.attributes);
			const hasClick = hasOnClick(element.attributes);

			// No href attribute
			if (href === undefined) {
				if (hasClick) {
					context.report({
						message: "shouldBeButton",
						range: getTSNodeRange(element, context.sourceFile),
					});
				} else {
					context.report({
						message: "missingHref",
						range: getTSNodeRange(element, context.sourceFile),
					});
				}
				return;
			}

			// href exists and is a string literal
			if (typeof href === "string") {
				if (isInvalidHref(href)) {
					if (hasClick) {
						context.report({
							data: { href },
							message: "shouldBeButton",
							range: getTSNodeRange(element, context.sourceFile),
						});
					} else {
						context.report({
							data: { href },
							message: "invalidHref",
							range: getTSNodeRange(element, context.sourceFile),
						});
					}
				}
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkAnchor(node);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkAnchor(node);
				},
			},
		};
	},
});
