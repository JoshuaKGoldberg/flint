import {
	getTSNodeRange,
	TypeScriptFileServices,
	typescriptLanguage,
} from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports usage of the children prop.",
		id: "childrenProps",
		preset: "stylistic",
	},
	messages: {
		noChildrenProp: {
			primary:
				"Prefer providing children as content between opening and closing tags, not as a `children` prop.",
			secondary: [
				"Using the `children` prop is not idiomatic in JSX.",
				"Pass children as content between opening and closing tags instead.",
				"This makes the JSX more readable and maintainable.",
			],
			suggestions: [
				"Remove the children prop and pass children as content between tags.",
			],
		},
	},
	setup(context) {
		function checkElement(
			node: ts.JsxOpeningLikeElement,
			{ sourceFile }: TypeScriptFileServices,
		) {
			for (const property of node.attributes.properties) {
				if (
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "children"
				) {
					context.report({
						message: "noChildrenProp",
						range: getTSNodeRange(property, sourceFile),
					});
					return;
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
