import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports autoFocus props that are not set to false.",
		id: "autoFocusProps",
		preset: "logical",
	},
	messages: {
		noAutoFocus: {
			primary: "Avoid using the `autoFocus` prop.",
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
		function checkElement(attributes: ts.JsxAttributes) {
			for (const attr of attributes.properties) {
				if (!ts.isJsxAttribute(attr) || !ts.isIdentifier(attr.name)) {
					continue;
				}

				const propName = attr.name.text;
				if (propName.toLowerCase() !== "autofocus") {
					continue;
				}

				// Check if autoFocus is set to false
				let isFalse = false;
				if (attr.initializer) {
					if (ts.isStringLiteral(attr.initializer)) {
						isFalse = attr.initializer.text === "false";
					} else if (ts.isJsxExpression(attr.initializer)) {
						const expr = attr.initializer.expression;
						if (expr && expr.kind === ts.SyntaxKind.FalseKeyword) {
							isFalse = true;
						}
					}
				}

				// Report if autoFocus is not explicitly false
				if (!isFalse) {
					context.report({
						message: "noAutoFocus",
						range: getTSNodeRange(attr, context.sourceFile),
					});
				}
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkElement(node.attributes);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkElement(node.attributes);
				},
			},
		};
	},
});
