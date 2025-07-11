import { TestCase } from "@flint.fyi/rule-tester";
import * as ts from "typescript";

import { isTruthy } from "./isTruthy.js";
import { tsAstToLiteral } from "./tsAstToLiteral.js";

export interface ParsedTestCase extends TestCase {
	node: ts.Node;
}

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
		invalid: invalid.elements.map(parseTestCase).filter(isTruthy),
		valid: valid.elements.map(parseTestCase).filter(isTruthy),
	};
}

function findProperty<Node extends ts.Node>(
	properties: ts.NodeArray<ts.ObjectLiteralElementLike>,
	name: string,
	predicate: (node: ts.Node) => node is Node,
) {
	return properties.find(
		(property): property is ts.PropertyAssignment & { initializer: Node } =>
			ts.isPropertyAssignment(property) &&
			ts.isIdentifier(property.name) &&
			property.name.text === name &&
			predicate(property.initializer),
	)?.initializer;
}

function parseTestCase(node: ts.Expression): ParsedTestCase | undefined {
	if (ts.isStringLiteralLike(node)) {
		return {
			code: node.text,
			node,
		};
	}

	if (!ts.isObjectLiteralExpression(node)) {
		return undefined;
	}

	const code = findProperty(node.properties, "code", ts.isStringLiteralLike);
	if (!code) {
		return undefined;
	}

	const fileName = findProperty(
		node.properties,
		"fileName",
		ts.isStringLiteralLike,
	);
	const options = findProperty(
		node.properties,
		"options",
		ts.isObjectLiteralExpression,
	);

	return {
		code: code.text,
		fileName: fileName?.text,
		node,
		options: options && tsAstToLiteral(options),
	};
}
