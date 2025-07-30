import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		id: "consecutiveNonNullAssertions",
		preset: "logical",
	},
	messages: {
		consecutiveNonNullAssertion: {
			primary: "Consecutive non-null assertion operators are unnecessary.",
			secondary: [
				"The non-null assertion operator (`!`) is used to assert that a value is not null or undefined.",
				"Using it multiple times in a row does not do anything, and just takes up space unnecessarily.",
			],
			suggestions: ["Remove the redundant non-null assertion operator."],
		},
	},
	setup(context) {
		return {
			visitors: {
				NonNullExpression: (node) => {
					if (node.parent.kind !== ts.SyntaxKind.NonNullExpression) {
						return;
					}

					const range = {
						begin: node.end,
						end: node.parent.end + 1,
					};

					context.report({
						fix: {
							range,
							text: "",
						},
						message: "consecutiveNonNullAssertion",
						range,
					});
				},
			},
		};
	},
});
