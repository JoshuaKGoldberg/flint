import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";

function isSimpleEqualityCheck(
	node: ts.ArrowFunction | ts.FunctionExpression,
	paramName: string,
) {
	let body: ts.Expression | undefined;

	if (ts.isArrowFunction(node)) {
		if (ts.isBlock(node.body)) {
			if (node.body.statements.length !== 1) {
				return undefined;
			}
			const statement = node.body.statements[0];
			if (
				!statement ||
				!ts.isReturnStatement(statement) ||
				!statement.expression
			) {
				return undefined;
			}
			body = statement.expression;
		} else {
			body = node.body;
		}
	} else if (ts.isFunctionExpression(node)) {
		if (node.body.statements.length !== 1) {
			return undefined;
		}
		const statement = node.body.statements[0];
		if (
			!statement ||
			!ts.isReturnStatement(statement) ||
			!statement.expression
		) {
			return undefined;
		}
		body = statement.expression;
	}

	if (!body || !ts.isBinaryExpression(body)) {
		return undefined;
	}

	const { left, operatorToken, right } = body;

	if (
		operatorToken.kind !== ts.SyntaxKind.EqualsEqualsToken &&
		operatorToken.kind !== ts.SyntaxKind.EqualsEqualsEqualsToken
	) {
		return undefined;
	}

	const isLeftParam = ts.isIdentifier(left) && left.text === paramName;
	const isRightParam = ts.isIdentifier(right) && right.text === paramName;

	if (isLeftParam && !isRightParam) {
		return right;
	}
	if (isRightParam && !isLeftParam) {
		return left;
	}

	return undefined;
}

function isSomeWithSimpleEquality(node: ts.CallExpression) {
	if (!ts.isPropertyAccessExpression(node.expression)) {
		return false;
	}

	if (node.expression.name.text !== "some") {
		return false;
	}

	if (node.arguments.length !== 1) {
		return false;
	}

	const callback = node.arguments[0];
	if (!callback) {
		return false;
	}

	if (!ts.isArrowFunction(callback) && !ts.isFunctionExpression(callback)) {
		return false;
	}

	if (callback.parameters.length !== 1) {
		return false;
	}

	const param = callback.parameters[0];
	if (!param || !ts.isIdentifier(param.name)) {
		return false;
	}

	const paramName = param.name.text;
	const comparedValue = isSimpleEqualityCheck(callback, paramName);

	return comparedValue !== undefined;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using `Array#some()` with simple equality checks that can be replaced with `.includes()`.",
		id: "arrayIncludesMethods",
		preset: "stylistic",
	},
	messages: {
		preferIncludes: {
			primary:
				"Prefer `.includes()` over `.some()` with a simple equality check.",
			secondary: [
				"`Array.prototype.some()` is intended for more complex predicate checks.",
				"For simple equality checks, `.includes()` is more readable and expressive.",
			],
			suggestions: [
				"Replace `.some(x => x === value)` with `.includes(value)`.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile }) => {
					if (isSomeWithSimpleEquality(node)) {
						context.report({
							message: "preferIncludes",
							range: getTSNodeRange(node, sourceFile),
						});
					}
				},
			},
		};
	},
});
