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
		function getHrefValue(attributes: ts.JsxAttributes) {
			const hrefProperty = attributes.properties.find(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "href",
			);

			if (!hrefProperty || !ts.isJsxAttribute(hrefProperty)) {
				return undefined;
			}

			if (
				hrefProperty.initializer &&
				ts.isStringLiteral(hrefProperty.initializer)
			) {
				return hrefProperty.initializer.text;
			}

			return "";
		}

		function hasOnClick(attributes: ts.JsxAttributes) {
			return attributes.properties.some(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "onClick",
			);
		}

		function isInvalidHref(href: string) {
			return href === "#" || href.startsWith("javascript:");
		}

		function checkAnchor(node: ts.JsxOpeningLikeElement) {
			if (!ts.isIdentifier(node.tagName) || node.tagName.text !== "a") {
				return;
			}

			const href = getHrefValue(node.attributes);
			const hasClick = hasOnClick(node.attributes);

			if (href === undefined) {
				context.report({
					message: hasClick ? "shouldBeButton" : "missingHref",
					range: getTSNodeRange(node, context.sourceFile),
				});
				return;
			}

			if (typeof href === "string" && isInvalidHref(href)) {
				context.report({
					data: { href },
					message: hasClick ? "shouldBeButton" : "invalidHref",
					range: getTSNodeRange(node, context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				JsxOpeningElement: checkAnchor,
				JsxSelfClosingElement: checkAnchor,
			},
		};
	},
});
