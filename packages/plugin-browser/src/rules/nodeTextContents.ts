import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Prefer `textContent` over `innerText` for DOM nodes.",
		id: "nodeTextContents",
		preset: "logical",
	},
	messages: {
		preferTextContent: {
			primary: "Prefer `textContent` over `innerText`.",
			secondary: [
				"`textContent` is more performant because it doesn't trigger a reflow.",
				"`textContent` is more widely supported and standard across browsers.",
				"`innerText` is aware of styling and won't return text of hidden elements, which can lead to unexpected behavior.",
			],
			suggestions: ["Replace `innerText` with `textContent`."],
		},
	},
	setup(context) {
		return {
			visitors: {
				PropertyAccessExpression(node: ts.PropertyAccessExpression) {
					if (ts.isIdentifier(node.name) && node.name.text === "innerText") {
						context.report({
							message: "preferTextContent",
							range: getTSNodeRange(node.name, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
