import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";

const methodsReturningNewArray = new Set([
	"concat",
	"entries",
	"filter",
	"flat",
	"flatMap",
	"from",
	"keys",
	"map",
	"of",
	"slice",
	"split",
	"values",
]);

const objectStaticMethods = new Set(["entries", "keys", "values"]);

function isInlineArrayCreation(node: ts.Expression): boolean {
	if (ts.isArrayLiteralExpression(node)) {
		return true;
	}

	if (ts.isParenthesizedExpression(node)) {
		return isInlineArrayCreation(node.expression);
	}

	if (ts.isCallExpression(node)) {
		if (ts.isPropertyAccessExpression(node.expression)) {
			const methodName = node.expression.name.text;

			if (
				ts.isIdentifier(node.expression.expression) &&
				node.expression.expression.text === "Object" &&
				objectStaticMethods.has(methodName)
			) {
				return true;
			}

			if (
				ts.isIdentifier(node.expression.expression) &&
				node.expression.expression.text === "Array" &&
				(methodName === "from" || methodName === "of")
			) {
				return true;
			}

			if (methodsReturningNewArray.has(methodName)) {
				return true;
			}
		}

		if (
			ts.isIdentifier(node.expression) &&
			node.expression.text === "Array" &&
			ts.isNewExpression(node.parent)
		) {
			return true;
		}
	}

	if (
		ts.isNewExpression(node) &&
		ts.isIdentifier(node.expression) &&
		node.expression.text === "Array"
	) {
		return true;
	}

	return false;
}

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

					const arrayExpr = node.expression.expression;
					const inlineCheck = isInlineArrayCreation(arrayExpr);
					if (inlineCheck) {
						return;
					}

					const arrayText = arrayExpr.getText(sourceFile);
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
