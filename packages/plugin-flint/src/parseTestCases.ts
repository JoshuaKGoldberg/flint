import * as ts from "typescript";

import type { ParsedTestCase, ParsedTestCaseInvalid } from "./types.js";

import { findProperty } from "./findProperty.js";
import { tsAstToLiteral } from "./tsAstToLiteral.js";

export function parseTestCase(node: ts.Expression): ParsedTestCase | undefined {
	if (ts.isStringLiteralLike(node)) {
		return {
			code: node.text,
			nodes: {
				case: node,
				code: node,
			},
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
		nodes: {
			case: node,
			code,
			fileName,
			options,
		},
		options: options && tsAstToLiteral(options),
	};
}

export function parseTestCaseInvalid(
	node: ts.Expression,
): ParsedTestCaseInvalid | undefined {
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
	const snapshot = findProperty(
		node.properties,
		"snapshot",
		ts.isStringLiteralLike,
	);
	if (!snapshot) {
		return undefined;
	}

	return {
		code: code.text,
		fileName: fileName?.text,
		nodes: {
			case: node,
			code,
			fileName,
			options,
			snapshot,
		},
		options: options && tsAstToLiteral(options),
		snapshot: snapshot.text,
	};
}
