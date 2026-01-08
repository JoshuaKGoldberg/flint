import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";

function isArrayMapCall(node: ts.Expression): node is ts.CallExpression {
	if (!ts.isCallExpression(node)) {
		return false;
	}

	if (!ts.isPropertyAccessExpression(node.expression)) {
		return false;
	}

	return node.expression.name.text === "map" && node.arguments.length >= 1;
}

function isFlatCallWithDepthOne(node: ts.CallExpression) {
	if (node.arguments.length === 0) {
		return true;
	}

	if (node.arguments.length !== 1) {
		return false;
	}

	const arg = node.arguments[0];
	return arg && ts.isNumericLiteral(arg) && arg.text === "1";
}

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using `.map().flat()` when `.flatMap()` can be used.",
		id: "arrayFlatMapMethods",
		preset: "stylistic",
	},
	messages: {
		preferFlatMap: {
			primary: "Prefer `.flatMap()` over `.map().flat()`.",
			secondary: [
				"`.flatMap()` combines mapping and flattening in a single step, which is more concise and efficient.",
				"Using `.map().flat()` creates an intermediate array that is immediately discarded.",
			],
			suggestions: [
				"Replace `.map(callback).flat()` with `.flatMap(callback)`.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile }) => {
					if (!ts.isPropertyAccessExpression(node.expression)) {
						return;
					}

					const methodName = node.expression.name.text;
					if (methodName !== "flat") {
						return;
					}

					if (!isFlatCallWithDepthOne(node)) {
						return;
					}

					const objectExpression = node.expression.expression;
					if (!isArrayMapCall(objectExpression)) {
						return;
					}

					context.report({
						message: "preferFlatMap",
						range: getTSNodeRange(node, sourceFile),
					});
				},
			},
		};
	},
});
