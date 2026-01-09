import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";
import type * as AST from "../types/ast.ts";

const nativeCoercionFunctions = new Set([
	"BigInt",
	"Boolean",
	"Number",
	"String",
	"Symbol",
]);

const arrayMethodsWithBooleanCallback = new Set([
	"every",
	"filter",
	"find",
	"findIndex",
	"findLast",
	"findLastIndex",
	"some",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports functions that wrap native coercion functions like `String`, `Number`, `BigInt`, `Boolean`, or `Symbol`.",
		id: "builtinCoercions",
		preset: "stylistic",
	},
	messages: {
		useBuiltin: {
			primary:
				"Prefer using `{{ coercionFunction }}` directly instead of wrapping it in a function.",
			secondary: [
				"Wrapping a native coercion function in another function adds unnecessary indirection.",
				"Using the built-in function directly is more concise and expresses intent more clearly.",
			],
			suggestions: ["Replace this function with `{{ coercionFunction }}`."],
		},
	},
	setup(context) {
		function checkFunction(
			node: AST.ArrowFunction | AST.FunctionExpression,
			sourceFile: ts.SourceFile,
		) {
			const problem = getFunctionProblem(node, sourceFile);
			if (problem) {
				context.report(problem);
			}
		}

		return {
			visitors: {
				ArrowFunction: (node, { sourceFile }) => {
					checkFunction(node, sourceFile);
				},
				FunctionExpression: (node, { sourceFile }) => {
					checkFunction(node, sourceFile);
				},
			},
		};
	},
});

function blockReturnsIdentifier(block: ts.Block, parameterName: string) {
	if (block.statements.length !== 1) {
		return false;
	}

	const statement = block.statements[0];
	if (!statement || !ts.isReturnStatement(statement) || !statement.expression) {
		return false;
	}

	return expressionMatchesName(statement.expression, parameterName);
}

function expressionMatchesName(expression: ts.Expression, name: string) {
	const unwrapped = ts.isParenthesizedExpression(expression)
		? expression.expression
		: expression;

	return ts.isIdentifier(unwrapped) && unwrapped.text === name;
}

function getCoercionCallName(
	expression: ts.Expression,
	parameterName: string,
): string | undefined {
	if (!ts.isCallExpression(expression)) {
		return undefined;
	}

	if (!ts.isIdentifier(expression.expression)) {
		return undefined;
	}

	const calleeName = expression.expression.text;
	if (!nativeCoercionFunctions.has(calleeName)) {
		return undefined;
	}

	if (expression.arguments.length !== 1) {
		return undefined;
	}

	const argument = expression.arguments[0];
	if (!argument || !ts.isIdentifier(argument)) {
		return undefined;
	}

	if (argument.text !== parameterName) {
		return undefined;
	}

	return calleeName;
}

function getCoercionWrapperProblem(
	node: AST.ArrowFunction | AST.FunctionExpression,
	parameterName: string,
	sourceFile: ts.SourceFile,
) {
	if (node.parameters.length !== 1) {
		return undefined;
	}

	const coercionFunction = getWrappedCoercionFunction(node, parameterName);
	if (!coercionFunction) {
		return undefined;
	}

	return {
		data: { coercionFunction },
		fix: {
			range: {
				begin: node.getStart(sourceFile),
				end: node.getEnd(),
			},
			text: coercionFunction,
		},
		message: "useBuiltin" as const,
		range: {
			begin: node.getStart(sourceFile),
			end: node.getEnd(),
		},
	};
}

function getFunctionProblem(
	node: AST.ArrowFunction | AST.FunctionExpression,
	sourceFile: ts.SourceFile,
) {
	if (node.parameters.length === 0) {
		return undefined;
	}

	const firstParameter = node.parameters[0];
	if (!firstParameter || !ts.isIdentifier(firstParameter.name)) {
		return undefined;
	}

	const parameterName = firstParameter.name.text;

	const identityProblem = getIdentityCallbackProblem(node, sourceFile);
	if (identityProblem) {
		return identityProblem;
	}

	return getCoercionWrapperProblem(node, parameterName, sourceFile);
}

function getIdentityCallbackProblem(
	node: AST.ArrowFunction | AST.FunctionExpression,
	sourceFile: ts.SourceFile,
) {
	if (!isIdentityFunction(node)) {
		return undefined;
	}

	if (!isArrayMethodCallback(node)) {
		return undefined;
	}

	return {
		data: { coercionFunction: "Boolean" },
		fix: {
			range: {
				begin: node.getStart(sourceFile),
				end: node.getEnd(),
			},
			text: "Boolean",
		},
		message: "useBuiltin" as const,
		range: {
			begin: node.getStart(sourceFile),
			end: node.getEnd(),
		},
	};
}

function getWrappedCoercionFunction(
	node: AST.ArrowFunction | AST.FunctionExpression,
	parameterName: string,
): string | undefined {
	if (node.kind === ts.SyntaxKind.ArrowFunction) {
		if (!ts.isBlock(node.body)) {
			return getCoercionCallName(
				node.body as unknown as ts.Expression,
				parameterName,
			);
		}
	}

	if (!ts.isBlock(node.body)) {
		return undefined;
	}

	if (node.body.statements.length !== 1) {
		return undefined;
	}

	const statement = node.body.statements[0];
	if (!statement || !ts.isReturnStatement(statement) || !statement.expression) {
		return undefined;
	}

	return getCoercionCallName(statement.expression, parameterName);
}

function isArrayMethodCallback(
	node: AST.ArrowFunction | AST.FunctionExpression,
): boolean {
	const parent = node.parent;
	if (!ts.isCallExpression(parent)) {
		return false;
	}

	if (parent.arguments[0] !== node) {
		return false;
	}

	if (!ts.isPropertyAccessExpression(parent.expression)) {
		return false;
	}

	const methodName = parent.expression.name.text;
	return arrayMethodsWithBooleanCallback.has(methodName);
}

function isIdentityFunction(
	node: AST.ArrowFunction | AST.FunctionExpression,
): boolean {
	if (node.parameters.length !== 1) {
		return false;
	}

	const parameter = node.parameters[0];
	if (!parameter || !ts.isIdentifier(parameter.name)) {
		return false;
	}

	const parameterName = parameter.name.text;

	if (node.kind === ts.SyntaxKind.ArrowFunction) {
		if (!ts.isBlock(node.body)) {
			return expressionMatchesName(
				node.body as unknown as ts.Expression,
				parameterName,
			);
		}
	}

	if (!ts.isBlock(node.body)) {
		return false;
	}

	return blockReturnsIdentifier(node.body, parameterName);
}
