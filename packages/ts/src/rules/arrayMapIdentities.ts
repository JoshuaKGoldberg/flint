import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports identity callbacks in `flatMap` calls that can be replaced with `flat`.",
		id: "arrayMapIdentities",
		preset: "logical",
	},
	messages: {
		preferFlat: {
			primary:
				"Use `.flat()` instead of `.flatMap()` with an identity callback.",
			secondary: [
				"An identity callback returns its input unchanged, making `.flatMap()` equivalent to `.flat()`.",
			],
			suggestions: ["Replace `.flatMap(...)` with `.flat()`."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile, typeChecker }) => {
					if (!ts.isPropertyAccessExpression(node.expression)) {
						return;
					}

					if (node.expression.name.text !== "flatMap") {
						return;
					}

					if (node.arguments.length !== 1) {
						return;
					}

					const callback = node.arguments[0];
					if (!isIdentityCallback(callback)) {
						return;
					}

					if (!isArrayType(node.expression.expression, typeChecker)) {
						return;
					}

					const arrayText = node.expression.expression.getText(sourceFile);

					context.report({
						fix: {
							range: {
								begin: node.getStart(sourceFile),
								end: node.getEnd(),
							},
							text: `${arrayText}.flat()`,
						},
						message: "preferFlat",
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

function getSingleParameterName(
	parameters: ts.NodeArray<ts.ParameterDeclaration>,
) {
	if (parameters.length !== 1) {
		return undefined;
	}

	const param = parameters[0];
	if (!ts.isIdentifier(param.name)) {
		return undefined;
	}

	return param.name.text;
}

function isArrayType(node: ts.Node, typeChecker: ts.TypeChecker) {
	const type = typeChecker.getTypeAtLocation(node);
	return typeChecker.isArrayType(type);
}

function isIdentityArrowFunction(node: ts.ArrowFunction) {
	const parameterName = getSingleParameterName(node.parameters);
	if (!parameterName) {
		return false;
	}

	if (ts.isIdentifier(node.body)) {
		return node.body.text === parameterName;
	}

	if (ts.isBlock(node.body)) {
		return isIdentityBlockBody(node.body, parameterName);
	}

	return false;
}

function isIdentityBlockBody(body: ts.Block, parameterName: string) {
	if (body.statements.length !== 1) {
		return false;
	}

	const statement = body.statements[0];
	if (!ts.isReturnStatement(statement)) {
		return false;
	}

	if (!statement.expression) {
		return false;
	}

	if (!ts.isIdentifier(statement.expression)) {
		return false;
	}

	return statement.expression.text === parameterName;
}

function isIdentityCallback(node: ts.Node): boolean {
	if (ts.isArrowFunction(node)) {
		return isIdentityArrowFunction(node);
	}

	if (ts.isFunctionExpression(node)) {
		return isIdentityFunctionExpression(node);
	}

	return false;
}

function isIdentityFunctionExpression(node: ts.FunctionExpression) {
	const parameterName = getSingleParameterName(node.parameters);
	if (!parameterName) {
		return false;
	}

	return isIdentityBlockBody(node.body, parameterName);
}
