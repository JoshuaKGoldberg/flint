import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";

function isConcatApply(node: ts.CallExpression) {
	if (!ts.isPropertyAccessExpression(node.expression)) {
		return false;
	}

	if (node.expression.name.text !== "apply") {
		return false;
	}

	const callExpression = node.expression.expression;
	if (!ts.isPropertyAccessExpression(callExpression)) {
		return false;
	}

	if (callExpression.name.text !== "concat") {
		return false;
	}

	const concatObject = callExpression.expression;

	const isEmptyArrayConcat = isEmptyArrayLiteral(concatObject);
	const isArrayPrototypeConcat =
		ts.isPropertyAccessExpression(concatObject) &&
		ts.isIdentifier(concatObject.expression) &&
		concatObject.expression.text === "Array" &&
		concatObject.name.text === "prototype";

	if (!isEmptyArrayConcat && !isArrayPrototypeConcat) {
		return false;
	}

	if (node.arguments.length !== 2) {
		return false;
	}

	const firstArg = node.arguments[0];
	return firstArg && isEmptyArrayLiteral(firstArg);
}

function isConcatCall(node: ts.CallExpression) {
	if (!ts.isPropertyAccessExpression(node.expression)) {
		return false;
	}

	if (node.expression.name.text !== "call") {
		return false;
	}

	const callExpression = node.expression.expression;
	if (!ts.isPropertyAccessExpression(callExpression)) {
		return false;
	}

	if (callExpression.name.text !== "concat") {
		return false;
	}

	const concatObject = callExpression.expression;
	if (
		!ts.isPropertyAccessExpression(concatObject) ||
		!ts.isIdentifier(concatObject.expression) ||
		concatObject.expression.text !== "Array" ||
		concatObject.name.text !== "prototype"
	) {
		return false;
	}

	if (node.arguments.length !== 2) {
		return false;
	}

	const firstArg = node.arguments[0];
	if (!firstArg || !isEmptyArrayLiteral(firstArg)) {
		return false;
	}

	const secondArg = node.arguments[1];
	return secondArg && ts.isSpreadElement(secondArg);
}

function isConcatSpread(node: ts.CallExpression) {
	if (!ts.isPropertyAccessExpression(node.expression)) {
		return false;
	}

	if (node.expression.name.text !== "concat") {
		return false;
	}

	const object = node.expression.expression;
	if (!isEmptyArrayLiteral(object)) {
		return false;
	}

	if (node.arguments.length !== 1) {
		return false;
	}

	const arg = node.arguments[0];
	return arg && ts.isSpreadElement(arg);
}

function isEmptyArrayLiteral(node: ts.Expression) {
	return ts.isArrayLiteralExpression(node) && node.elements.length === 0;
}

function isIdentityArrowFunction(node: ts.Expression) {
	if (!ts.isArrowFunction(node)) {
		return false;
	}

	if (node.parameters.length !== 1) {
		return false;
	}

	const param = node.parameters[0];
	if (!param || !ts.isIdentifier(param.name)) {
		return false;
	}

	const paramName = param.name.text;
	const body = node.body;

	return ts.isIdentifier(body) && body.text === paramName;
}

function isIdentityFlatMapCall(node: ts.CallExpression) {
	if (!ts.isPropertyAccessExpression(node.expression)) {
		return false;
	}

	if (node.expression.name.text !== "flatMap") {
		return false;
	}

	if (node.arguments.length !== 1) {
		return false;
	}

	const arg = node.arguments[0];
	return arg && isIdentityArrowFunction(arg);
}

function isLodashFlatten(node: ts.CallExpression) {
	if (!ts.isPropertyAccessExpression(node.expression)) {
		return false;
	}

	if (node.expression.name.text !== "flatten") {
		return false;
	}

	if (!ts.isIdentifier(node.expression.expression)) {
		return false;
	}

	const objectName = node.expression.expression.text;
	return (
		objectName === "_" || objectName === "lodash" || objectName === "underscore"
	);
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports legacy techniques to flatten arrays instead of using `.flat()`.",
		id: "arrayFlatMethods",
		preset: "stylistic",
	},
	messages: {
		preferFlat: {
			primary: "Prefer `.flat()` over legacy array flattening techniques.",
			secondary: [
				"ES2019 introduced `Array.prototype.flat()` as the standard way to flatten arrays.",
				"Using modern array methods improves code readability and consistency.",
			],
			suggestions: ["Replace this with `.flat()`."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile }) => {
					if (
						isIdentityFlatMapCall(node) ||
						isConcatSpread(node) ||
						isConcatApply(node) ||
						isConcatCall(node) ||
						isLodashFlatten(node)
					) {
						context.report({
							message: "preferFlat",
							range: getTSNodeRange(node, sourceFile),
						});
					}
				},
			},
		};
	},
});
