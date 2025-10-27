import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";
import { isGlobalDeclaration } from "../utils/isGlobalDeclaration.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallows using `new` with global non-constructor functions like Symbol and BigInt.",
		id: "newNativeNonConstructors",
		preset: "untyped",
	},
	messages: {
		noNewNonConstructor: {
			primary: "{{ name }} cannot be called with `new`.",
			secondary: [
				"`Symbol` and `BigInt` are not constructors and will throw a `TypeError` when called with `new`.",
				"These functions should be called directly without the `new` keyword to create their respective values.",
			],
			suggestions: ["Remove the `new` keyword and call the function directly."],
		},
	},
	setup(context) {
		return {
			visitors: {
				NewExpression: (node) => {
					if (!ts.isIdentifier(node.expression)) {
						return;
					}

					const name = node.expression.text;
					if (
						!["BigInt", "Symbol"].includes(name) ||
						!isGlobalDeclaration(node.expression, context.typeChecker)
					) {
						return;
					}

					context.report({
						data: { name },
						fix: {
							range: {
								begin: node.getStart(context.sourceFile),
								end: node.expression.getStart(context.sourceFile),
							},
							text: "",
						},
						message: "noNewNonConstructor",
						range: getTSNodeRange(
							node.getChildAt(0, context.sourceFile),
							context.sourceFile,
						),
					});
				},
			},
		};
	},
});
