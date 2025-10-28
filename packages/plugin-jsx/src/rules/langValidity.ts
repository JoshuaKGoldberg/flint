import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

/**
 * Validates if a language code follows the BCP 47 format.
 *
 * BCP 47 language tags consist of:
 * - Primary language subtag (2-3 letters, or 4-8 letters for extended language subtags).
 * - Optional extlang subtag (3 letters, can have up to 3).
 * - Optional script subtag (4 letters).
 * - Optional region subtag (2 letters or 3 digits).
 * - Optional variant, extension, and private use subtags.
 * @example
 * "en", "en-US", "zh-Hans", "zh-Hans-CN", "en-GB-oxendict"
 */
function isValidLanguageCode(lang: string): boolean {
	if (!lang || typeof lang !== "string") {
		return false;
	}

	const trimmedLang = lang.trim();

	if (!trimmedLang) {
		return false;
	}

	// BCP 47 language tag pattern (simplified but strict enough)
	// Matches the primary language subtag (2-8 letters)
	// Followed by optional subtags:
	// - extlang: 3 letters (up to 3 times)
	// - script: 4 letters
	// - region: 2 letters or 3 digits
	// - variant: 5-8 alphanumeric OR 4 starting with digit
	// - extension: single char + 2-8 alphanumeric (repeated)
	// - private use: x- followed by 1-8 alphanumeric (repeated)
	const bcp47Pattern =
		/^[a-z]{2,8}(?:-[a-z]{3}){0,3}(?:-[a-z]{4})?(?:-(?:[a-z]{2}|\d{3}))?(?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*(?:-[0-9a-wyz](?:-[\da-z]{2,8})+)*(?:-x(?:-[\da-z]{1,8})+)?$/i;

	return bcp47Pattern.test(trimmedLang);
}

export default typescriptLanguage.createRule({
	about: {
		description: "Reports invalid lang attribute values.",
		id: "langValidity",
		preset: "logical",
	},
	messages: {
		invalidLang: {
			primary:
				"The lang attribute value '{{ value }}' is not a valid BCP 47 language tag.",
			secondary: [
				"The lang attribute must contain a valid BCP 47 language tag.",
				"Valid examples include 'en', 'en-US', 'zh-Hans', or 'fr-CA'.",
				"This is required for WCAG 3.1.2 compliance.",
			],
			suggestions: [
				"Use a valid BCP 47 language tag like 'en' or 'en-US'",
				"Check the language code spelling and format",
			],
		},
	},
	setup(context) {
		function checkElement(node: ts.JsxOpeningLikeElement) {
			const langAttribute = node.attributes.properties.find(
				(property): property is ts.JsxAttribute =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "lang",
			);

			if (!langAttribute?.initializer) {
				return;
			}

			if (ts.isStringLiteral(langAttribute.initializer)) {
				const langValue = langAttribute.initializer.text;

				if (!isValidLanguageCode(langValue)) {
					context.report({
						data: { value: langValue || "(empty)" },
						message: "invalidLang",
						range: getTSNodeRange(
							langAttribute.initializer,
							context.sourceFile,
						),
					});
				}
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
