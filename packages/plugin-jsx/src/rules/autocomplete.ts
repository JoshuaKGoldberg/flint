import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const validAutocompleteValues = new Set([
	"address-level1",
	"address-level2",
	"address-level3",
	"address-level4",
	"address-line1",
	"address-line2",
	"address-line3",
	"bday",
	"bday-day",
	"bday-month",
	"bday-year",
	"cc-additional-name",
	"cc-csc",
	"cc-exp",
	"cc-exp-month",
	"cc-exp-year",
	"cc-family-name",
	"cc-given-name",
	"cc-name",
	"cc-number",
	"cc-type",
	"country",
	"country-name",
	"current-password",
	"email",
	"impp",
	"language",
	"name",
	"new-password",
	"off",
	"on",
	"one-time-code",
	"organization",
	"organization-title",
	"photo",
	"postal-code",
	"sex",
	"street-address",
	"tel",
	"tel-area-code",
	"tel-country-code",
	"tel-extension",
	"tel-local",
	"tel-national",
	"transaction-amount",
	"transaction-currency",
	"url",
	"username",
	"webauthn",
]);

const billingAndShippingValues = new Set([
	"address-level1",
	"address-level2",
	"address-level3",
	"address-level4",
	"address-line1",
	"address-line2",
	"address-line3",
	"country",
	"country-name",
	"postal-code",
	"street-address",
]);

function isValidAutocompleteValue(value: string): boolean {
	const parts = value.trim().split(/\s+/);

	if (parts.length === 1) {
		return validAutocompleteValues.has(parts[0]);
	}

	if (parts.length === 2) {
		const [prefix, token] = parts;
		if (prefix === "billing" || prefix === "shipping") {
			return billingAndShippingValues.has(token);
		}
	}

	return false;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Ensure the autocomplete attribute is correct and suitable for the form field.",
		id: "autocomplete",
		preset: "logical",
	},
	messages: {
		invalidAutocomplete: {
			primary: "`{{ value }}` is not a valid value for autocomplete.",
			secondary: [
				"The autocomplete attribute must use valid tokens from the HTML specification.",
				"Valid values help browsers and assistive technologies provide better user experiences.",
				"This is required for WCAG 1.3.5 compliance.",
			],
			suggestions: [
				"Use standard autocomplete tokens like 'name', 'email', 'tel', or 'off'",
				"For address fields, use 'billing' or 'shipping' prefix with appropriate field tokens",
				"Check the HTML specification for the complete list of valid autocomplete tokens",
			],
		},
	},
	setup(context) {
		function checkNode(node: ts.JsxOpeningElement | ts.JsxSelfClosingElement) {
			const { attributes, tagName } = node;
			if (!ts.isIdentifier(tagName)) {
				return;
			}

			const elementName = tagName.text.toLowerCase();
			if (elementName !== "input") {
				return;
			}

			const autocompleteAttribute = attributes.properties.find(
				(attribute) =>
					ts.isJsxAttribute(attribute) &&
					ts.isIdentifier(attribute.name) &&
					attribute.name.text.toLowerCase() === "autocomplete",
			);

			if (!autocompleteAttribute || !ts.isJsxAttribute(autocompleteAttribute)) {
				return;
			}

			const { initializer, name } = autocompleteAttribute;
			if (!initializer) {
				return;
			}

			let autocompleteValue: string | undefined;

			if (ts.isStringLiteral(initializer)) {
				autocompleteValue = initializer.text;
			} else if (ts.isJsxExpression(initializer) && initializer.expression) {
				if (ts.isStringLiteral(initializer.expression)) {
					autocompleteValue = initializer.expression.text;
				}
			}

			if (autocompleteValue === undefined) {
				return;
			}

			if (!isValidAutocompleteValue(autocompleteValue)) {
				context.report({
					data: { value: autocompleteValue },
					message: "invalidAutocomplete",
					range: getTSNodeRange(name, context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				JsxOpeningElement: checkNode,
				JsxSelfClosingElement: checkNode,
			},
		};
	},
});
