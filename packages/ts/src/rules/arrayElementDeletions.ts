import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using the `delete` operator on array values.",
		id: "arrayElementDeletions",
		preset: "logical",
	},
	messages: {
		noArrayDelete: {
			primary: "Avoid using the `delete` operator on arrays.",
			secondary: [
				"Using `delete` on an array element removes it but leaves an empty slot, which can lead to unexpected behavior.",
				"The array's `length` property is not affected, and the element becomes `undefined` with a hole in the array.",
			],
			suggestions: [
				"Use `Array#splice()` to remove elements and shift remaining elements.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				DeleteExpression: (node, { sourceFile, typeChecker }) => {
					if (!ts.isElementAccessExpression(node.expression)) {
						return;
					}

					const elementAccess = node.expression;
					const objectType = typeChecker.getTypeAtLocation(
						elementAccess.expression,
					);

					if (!typeChecker.isArrayType(objectType)) {
						return;
					}

					context.report({
						message: "noArrayDelete",
						range: getTSNodeRange(node, sourceFile),
					});
				},
			},
		};
	},
});
