import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { createRule } from "../createRule.js";
import { getConstrainedTypeAtLocation } from "./utils/getConstrainedType.js";
import { isTypeRecursive } from "./utils/isTypeRecursive.js";

export default createRule({
	about: {
		id: "forInArrays",
		preset: "logical",
	},
	messages: {
		preferModules:
			"For-in loops over arrays have surprising behavior that often leads to bugs.",
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
						message: "preferModules",
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
