import {
	getTSNodeRange,
	TypeScriptFileServices,
	typescriptLanguage,
} from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports autoFocus props that are not set to false.",
		id: "autoFocusProps",
		preset: "logical",
	},
	messages: {
		noAutoFocus: {
			primary:
				"The `autoFocus` prop disruptively forces unintuitive focus behavior.",
			secondary: [
				"Auto-focusing elements can cause usability issues for sighted and non-sighted users.",
				"It can be disruptive to users who rely on screen readers or keyboard navigation.",
				"Consider letting users focus elements manually instead.",
			],
			suggestions: [
				"Remove the autoFocus prop",
				"Set autoFocus to false: autoFocus={false}",
			],
		},
	},
	setup(context) {
		function isSetToFalse(property: ts.JsxAttribute) {
			if (!property.initializer) {
				return false;
			}

			if (ts.isStringLiteral(property.initializer)) {
				return property.initializer.text === "false";
			}

			if (ts.isJsxExpression(property.initializer)) {
				const expr = property.initializer.expression;
				if (expr && expr.kind === ts.SyntaxKind.FalseKeyword) {
					return true;
				}
			}

			return false;
		}

		function checkElement(
			node: ts.JsxOpeningLikeElement,
			{ sourceFile }: TypeScriptFileServices,
		) {
			for (const property of node.attributes.properties) {
				if (
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text.toLowerCase() === "autofocus" &&
					!isSetToFalse(property)
				) {
					context.report({
						message: "noAutoFocus",
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
