import {
	getTSNodeRange,
	type TypeScriptFileServices,
	typescriptLanguage,
} from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer shorthand boolean attributes over explicit {true} values in JSX.",
		id: "booleanValues",
		preset: "stylistic",
	},
	messages: {
		preferShorthand: {
			primary:
				"Prefer shorthand boolean attribute `{{ name }}` over explicit `{{ name }}={true}`.",
			secondary: [
				"Boolean attributes with explicit `{true}` values are redundant and verbose.",
				"The shorthand syntax is more concise and idiomatic in JSX.",
			],
			suggestions: ["Use the shorthand syntax: `{{ name }}`"],
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
					property.initializer &&
					ts.isJsxExpression(property.initializer) &&
					property.initializer.expression?.kind === ts.SyntaxKind.TrueKeyword
				) {
					context.report({
						data: { name: property.name.text },
						message: "preferShorthand",
						range: getTSNodeRange(property, sourceFile),
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
