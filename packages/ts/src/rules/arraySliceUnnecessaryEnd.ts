import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports unnecessary `end` argument in `.slice()` calls when it equals the length or is `Infinity`.",
		id: "arraySliceUnnecessaryEnd",
		preset: "stylistic",
	},
	messages: {
		unnecessaryEnd: {
			primary:
				"Omit the `end` argument when slicing to the end of the array or string.",
			secondary: [
				"Passing `.length` or `Infinity` as the `end` argument is unnecessary.",
				"The `.slice()` method defaults to the end when the second argument is omitted.",
			],
			suggestions: ["Remove the unnecessary `end` argument."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile }) => {
					if (!ts.isPropertyAccessExpression(node.expression)) {
						return;
					}

					if (node.expression.name.text !== "slice") {
						return;
					}

					if (node.arguments.length !== 2) {
						return;
					}

					const endArgument = node.arguments[1];
					if (!isUnnecessaryEnd(node.expression.expression, endArgument)) {
						return;
					}

					context.report({
						fix: {
							range: {
								begin: node.arguments[0].getEnd(),
								end: endArgument.getEnd(),
							},
							text: "",
						},
						message: "unnecessaryEnd",
						range: {
							begin: endArgument.getStart(sourceFile),
							end: endArgument.getEnd(),
						},
					});
				},
			},
		};
	},
});

function haveSameText(nodeA: ts.Node, nodeB: ts.Node) {
	return nodeA.getText() === nodeB.getText();
}

function isInfinity(node: ts.Expression) {
	if (ts.isIdentifier(node) && node.text === "Infinity") {
		return true;
	}

	if (
		ts.isPropertyAccessExpression(node) &&
		ts.isIdentifier(node.expression) &&
		node.expression.text === "Number" &&
		node.name.text === "POSITIVE_INFINITY"
	) {
		return true;
	}

	return false;
}

function isLengthOfReceiver(
	receiver: ts.Expression,
	endArgument: ts.Expression,
) {
	if (!ts.isPropertyAccessExpression(endArgument)) {
		return false;
	}

	if (endArgument.name.text !== "length") {
		return false;
	}

	return haveSameText(receiver, endArgument.expression);
}

function isUnnecessaryEnd(receiver: ts.Expression, endArgument: ts.Expression) {
	if (isInfinity(endArgument)) {
		return true;
	}

	return isLengthOfReceiver(receiver, endArgument);
}
