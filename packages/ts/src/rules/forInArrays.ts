import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";
import { getConstrainedTypeAtLocation } from "./utils/getConstrainedType.js";
import { isTypeRecursive } from "./utils/isTypeRecursive.js";

export default typescriptLanguage.createRule({
	about: {
		id: "forInArrays",
		preset: "logical",
	},
	messages: {
		forIn: {
			primary:
				"For-in loops over arrays have surprising behavior that often leads to bugs.",
			secondary: [
				"A for-in loop (`for (const i in o)`) iterates over all enumerable properties of an object, including those that are not array indices.",
				"This can lead to unexpected behavior when used with arrays, as it may include properties that are not part of the array's numeric indices.",
				"It also returns the index key (`i`) as a string, which is not the expected numeric type for array indices.",
			],
			suggestions: [
				"Use a construct more suited for arrays, such as a for-of loop (`for (const i of o)`).",
			],
		},
	},
	setup(context) {
		function hasNumberLikeLength(type: ts.Type): boolean {
			const lengthProperty = type.getProperty("length");

			if (lengthProperty == null) {
				return false;
			}

			return tsutils.isTypeFlagSet(
				context.typeChecker.getTypeOfSymbol(lengthProperty),
				ts.TypeFlags.NumberLike,
			);
		}

		function isArrayLike(type: ts.Type): boolean {
			return isTypeRecursive(
				type,
				(t) => t.getNumberIndexType() != null && hasNumberLikeLength(t),
			);
		}

		return {
			ForInStatement(node) {
				const type = getConstrainedTypeAtLocation(
					node.expression,
					context.typeChecker,
				);

				if (isArrayLike(type)) {
					context.report({
						message: "forIn",
						range: {
							begin: node.getStart(),
							end: node.statement.getStart() - 1,
						},
					});
				}
			},
		};
	},
});
