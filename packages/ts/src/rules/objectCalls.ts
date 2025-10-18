import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Use object literal notation {} or Object.create instead of calling Object as a constructor.",
		id: "objectCalls",
		preset: "logical",
	},
	messages: {
		preferObjectLiteral: {
			primary:
				"Use object literal notation {} or Object.create instead of calling Object as a constructor.",
			secondary: [
				"Calling Object as a constructor with new Object() is unnecessarily verbose and less idiomatic than using object literal syntax.",
				"Object literal notation {} is the preferred and more concise way to create plain objects.",
				"For creating objects without a prototype, use Object.create(null) instead of new Object().",
			],
			suggestions: [
				"Replace new Object() with {} to create an empty object.",
				"Use Object.create(null) when you need an object without a prototype.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				NewExpression: (node) => {
					if (
						ts.isIdentifier(node.expression) &&
						node.expression.text === "Object"
					) {
						context.report({
							message: "preferObjectLiteral",
							range: getTSNodeRange(
								node.getChildAt(0, context.sourceFile),
								context.sourceFile,
							),
						});
					}
				},
			},
		};
	},
});
