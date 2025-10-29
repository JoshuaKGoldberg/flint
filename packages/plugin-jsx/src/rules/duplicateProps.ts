import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Disallow duplicate props in JSX elements.",
		id: "duplicateProps",
		preset: "logical",
	},
	messages: {
		duplicateProp: {
			primary:
				"Duplicate prop `{{ propName }}` found in JSX element. The last occurrence will override earlier ones.",
			secondary: [
				"Having duplicate props can lead to unexpected behavior since only the last value is used.",
				"This makes the code harder to understand and maintain.",
			],
			suggestions: ["Remove the duplicate prop and keep only one definition."],
		},
	},
	setup(context) {
		function checkElement(node: ts.JsxOpeningLikeElement) {
			const seenProps = new Set<string>();

			for (const property of node.attributes.properties) {
				if (!ts.isJsxAttribute(property) || !ts.isIdentifier(property.name)) {
					continue;
				}

				const propName = property.name.text;

				if (seenProps.has(propName)) {
					context.report({
						data: { propName },
						message: "duplicateProp",
						range: getTSNodeRange(property.name, context.sourceFile),
					});
				} else {
					seenProps.add(propName);
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
