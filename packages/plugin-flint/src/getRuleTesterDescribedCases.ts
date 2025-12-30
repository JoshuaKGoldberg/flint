import { isTruthy } from "@flint.fyi/utils";
import * as ts from "typescript";

import { findProperty } from "./findProperty.ts";
import { parseTestCase, parseTestCaseInvalid } from "./parseTestCases.ts";

export function getRuleTesterDescribedCases(node: ts.CallExpression) {
	if (
		!ts.isPropertyAccessExpression(node.expression) ||
		!ts.isIdentifier(node.expression.expression) ||
		!ts.isIdentifier(node.expression.name) ||
		node.expression.name.text !== "describe" ||
		node.arguments.length !== 2
	) {
		return undefined;
	}

	// TODO: Check node.expression.expression's type for being a RuleTester
	// https://github.com/JoshuaKGoldberg/flint/issues/152

	const argument = node.arguments[1];
	if (!ts.isObjectLiteralExpression(argument)) {
		return undefined;
	}

	const invalid = findProperty(
		argument.properties,
		"invalid",
		ts.isArrayLiteralExpression,
	);
	if (!invalid) {
		return undefined;
	}

	const valid = findProperty(
		argument.properties,
		"valid",
		ts.isArrayLiteralExpression,
	);
	if (!valid) {
		return undefined;
	}

	return {
		invalid: invalid.elements.map(parseTestCaseInvalid).filter(isTruthy),
		valid: valid.elements.map(parseTestCase).filter(isTruthy),
	};
}
