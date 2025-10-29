import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports JSX elements with multiple spread attributes on the same element.",
		id: "duplicateSpreads",
		preset: "logical",
	},
	messages: {
		noMultipleSpreads: {
			primary:
				"Avoid using multiple spread attributes on the same JSX element.",
			secondary: [
				"Multiple spread attributes can make it unclear which props take precedence.",
				"Later spread attributes override properties from earlier ones.",
				"Consider merging the spread objects or using explicit props instead.",
			],
			suggestions: [
				"Merge spread objects into a single object",
				"Use explicit props instead of spreading multiple objects",
			],
		},
	},
	setup(context) {
		function checkElement(node: ts.JsxOpeningLikeElement) {
			const spreadAttributes: ts.JsxSpreadAttribute[] = [];

			for (const property of node.attributes.properties) {
				if (ts.isJsxSpreadAttribute(property)) {
					spreadAttributes.push(property);
				}
			}

			if (spreadAttributes.length > 1) {
				for (let i = 1; i < spreadAttributes.length; i++) {
					context.report({
						message: "noMultipleSpreads",
						range: getTSNodeRange(spreadAttributes[i], context.sourceFile),
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
