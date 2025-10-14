import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using empty destructuring patterns that destructure no values.",
		id: "emptyDestructures",
		preset: "logical",
	},
	messages: {
		emptyPattern: {
			primary:
				"Destructuring patterns that don't extract at least one value are unnecessary.",
			secondary: [
				"Empty destructuring patterns like `{}` or `[]` don't extract any values and serve no practical purpose.",
				"These patterns are likely mistakes or leftover code from refactoring.",
			],
			suggestions: [
				"Remove the empty destructuring pattern if it's not needed.",
				"Add bindings to extract values if you intended to destructure specific properties.",
			],
		},
	},
	setup(context) {
		function checkBindingPattern(
			node: ts.ArrayBindingPattern | ts.ObjectBindingPattern,
		) {
			if (node.elements.length === 0) {
				context.report({
					message: "emptyPattern",
					range: {
						begin: node.getStart(context.sourceFile),
						end: node.getEnd(),
					},
				});
			}
		}

		return {
			visitors: {
				ArrayBindingPattern: checkBindingPattern,
				ObjectBindingPattern: checkBindingPattern,
			},
		};
	},
});
