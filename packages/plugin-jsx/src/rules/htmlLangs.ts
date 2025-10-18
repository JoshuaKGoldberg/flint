import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports <html> elements without a lang prop.",
		id: "htmlLangs",
		preset: "logical",
	},
	messages: {
		missingLang: {
			primary: "This <html> element is missing a `lang` prop.",
			secondary: [
				"The lang attribute identifies the language of the document for screen readers and assistive technologies.",
				"Without it, screen readers may default to the user's system language, causing confusion.",
				"This is required for WCAG 3.1.1 compliance.",
			],
			suggestions: [
				'Add a lang prop with a valid language code (e.g., lang="en")',
				'Use lang="en-US" for more specific localization',
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					if (
						ts.isIdentifier(node.tagName) &&
						node.tagName.text === "html" &&
						!node.attributes.properties.some(
							(property) =>
								ts.isJsxAttribute(property) &&
								ts.isIdentifier(property.name) &&
								property.name.text.toLowerCase() === "lang",
						)
					) {
						context.report({
							message: "missingLang",
							range: getTSNodeRange(node.tagName, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
