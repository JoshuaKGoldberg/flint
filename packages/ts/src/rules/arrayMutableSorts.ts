import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports `.sort()` calls on arrays that mutate the original array.",
		id: "arrayMutableSorts",
		preset: "stylistic",
	},
	messages: {
		preferToSorted: {
			primary:
				"Use `.toSorted()` instead of `.sort()` to avoid mutating the original array.",
			secondary: [
				"The `.sort()` method mutates the array in place.",
				"The `.toSorted()` method returns a new sorted array without modifying the original.",
			],
			suggestions: ["Replace `.sort()` with `.toSorted()`."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile, typeChecker }) => {
					if (
						!ts.isPropertyAccessExpression(node.expression) ||
						node.expression.name.text !== "sort" ||
						!typeChecker.isArrayType(
							typeChecker.getTypeAtLocation(node.expression.expression),
						) ||
						ts.isExpressionStatement(node.parent)
					) {
						return;
					}

					const arrayText = node.expression.expression.getText(sourceFile);
					const argsText =
						node.arguments.length > 0
							? node.arguments.map((arg) => arg.getText(sourceFile)).join(", ")
							: "";

					context.report({
						fix: {
							range: getTSNodeRange(node, sourceFile),
							text: `${arrayText}.toSorted(${argsText})`,
						},
						message: "preferToSorted",
						range: {
							begin: node.expression.name.getStart(sourceFile),
							end: node.getEnd(),
						},
					});
				},
			},
		};
	},
});
