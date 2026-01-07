import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using `.filter()[0]` instead of `.find()` when looking for a single element.",
		id: "arrayFinds",
		preset: "stylistic",
	},
	messages: {
		preferFind: {
			primary:
				"Prefer `.find()` over `.filter()[0]` when looking for a single element.",
			secondary: [
				"Using `.find()` is more efficient because it stops searching after finding the first match.",
				"`.filter()[0]` unnecessarily iterates through the entire array.",
			],
			suggestions: ["Replace `.filter(...)[0]` with `.find(...)`."],
		},
	},
	setup(context) {
		return {
			visitors: {
				ElementAccessExpression: (node, { sourceFile, typeChecker }) => {
					if (!isZeroIndexAccess(node)) {
						return;
					}

					const filterCall = getFilterCall(node.expression);
					if (!filterCall) {
						return;
					}

					if (!isArrayType(filterCall.expression, typeChecker)) {
						return;
					}

					const filterArgs = filterCall.arguments;
					if (filterArgs.length === 0) {
						return;
					}

					const filterArgsText = filterArgs
						.map((arg) => arg.getText(sourceFile))
						.join(", ");
					const arrayText = (
						filterCall.expression as ts.PropertyAccessExpression
					).expression.getText(sourceFile);

					context.report({
						fix: {
							range: {
								begin: node.getStart(sourceFile),
								end: node.getEnd(),
							},
							text: `${arrayText}.find(${filterArgsText})`,
						},
						message: "preferFind",
						range: {
							begin: (
								filterCall.expression as ts.PropertyAccessExpression
							).name.getStart(sourceFile),
							end: node.getEnd(),
						},
					});
				},
			},
		};
	},
});

function getFilterCall(node: ts.Node): ts.CallExpression | undefined {
	if (!ts.isCallExpression(node)) {
		return undefined;
	}

	if (!ts.isPropertyAccessExpression(node.expression)) {
		return undefined;
	}

	if (node.expression.name.text !== "filter") {
		return undefined;
	}

	return node;
}

function isArrayType(node: ts.Node, typeChecker: ts.TypeChecker) {
	if (!ts.isPropertyAccessExpression(node)) {
		return false;
	}

	const type = typeChecker.getTypeAtLocation(node.expression);
	return typeChecker.isArrayType(type);
}

function isZeroIndexAccess(node: ts.ElementAccessExpression) {
	return (
		ts.isNumericLiteral(node.argumentExpression) &&
		node.argumentExpression.text === "0"
	);
}
