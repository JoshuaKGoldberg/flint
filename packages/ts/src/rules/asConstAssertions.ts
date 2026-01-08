import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";

function getExpressionValue(node: ts.Expression) {
	if (ts.isStringLiteral(node)) {
		return node.text;
	}
	if (ts.isNumericLiteral(node)) {
		return node.text;
	}
	if (node.kind === ts.SyntaxKind.TrueKeyword) {
		return "true";
	}
	if (node.kind === ts.SyntaxKind.FalseKeyword) {
		return "false";
	}
	return undefined;
}

function getLiteralValue(node: ts.TypeNode) {
	if (
		ts.isLiteralTypeNode(node) &&
		(ts.isStringLiteral(node.literal) || ts.isNumericLiteral(node.literal))
	) {
		return node.literal.text;
	}
	if (
		ts.isLiteralTypeNode(node) &&
		node.literal.kind === ts.SyntaxKind.TrueKeyword
	) {
		return "true";
	}
	if (
		ts.isLiteralTypeNode(node) &&
		node.literal.kind === ts.SyntaxKind.FalseKeyword
	) {
		return "false";
	}
	return undefined;
}

function isLiteralType(node: ts.TypeNode): boolean {
	return (
		ts.isLiteralTypeNode(node) &&
		(ts.isStringLiteral(node.literal) ||
			ts.isNumericLiteral(node.literal) ||
			node.literal.kind === ts.SyntaxKind.TrueKeyword ||
			node.literal.kind === ts.SyntaxKind.FalseKeyword)
	);
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using explicit literal types when `as const` can be used.",
		id: "asConstAssertions",
		preset: "stylistic",
	},
	messages: {
		preferAsConst: {
			primary: "Prefer `as const` over an explicit literal type assertion.",
			secondary: [
				"`as const` tells TypeScript to infer the literal type automatically.",
				"This avoids repeating the literal value and is more concise.",
			],
			suggestions: ["Replace the explicit literal type with `as const`."],
		},
		preferAsConstAnnotation: {
			primary: "Prefer `as const` over a literal type annotation.",
			secondary: [
				"When the literal type matches the initializer value, use `as const` instead.",
				"This avoids repeating the literal value and is more concise.",
			],
			suggestions: [
				"Remove the type annotation and add `as const` to the initializer.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				AsExpression: (node, { sourceFile }) => {
					if (!isLiteralType(node.type)) {
						return;
					}

					const typeValue = getLiteralValue(node.type);
					const exprValue = getExpressionValue(node.expression);

					if (typeValue !== undefined && typeValue === exprValue) {
						context.report({
							message: "preferAsConst",
							range: getTSNodeRange(node.type, sourceFile),
						});
					}
				},

				VariableDeclaration: (node, { sourceFile }) => {
					if (!node.type || !node.initializer) {
						return;
					}

					if (!isLiteralType(node.type)) {
						return;
					}

					const typeValue = getLiteralValue(node.type);
					const exprValue = getExpressionValue(node.initializer);

					if (typeValue !== undefined && typeValue === exprValue) {
						context.report({
							message: "preferAsConstAnnotation",
							range: getTSNodeRange(node.type, sourceFile),
						});
					}
				},
			},
		};
	},
});
