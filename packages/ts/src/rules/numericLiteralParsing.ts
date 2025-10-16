import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

function convertToLiteral(value: string, radix: number): string {
	const num = Number.parseInt(value, radix);
	if (Number.isNaN(num)) {
		return value;
	}

	switch (radix) {
		case 2:
			return `0b${num.toString(2)}`;
		case 8:
			return `0o${num.toString(8)}`;
		case 16:
			return `0x${num.toString(16).toUpperCase()}`;
		default:
			return value;
	}
}

function getRadixValue(node: ts.Expression): number | undefined {
	if (ts.isNumericLiteral(node)) {
		const value = Number(node.text);
		if (value === 2 || value === 8 || value === 16) {
			return value;
		}
	}
	return undefined;
}

function getStringValue(node: ts.Expression): string | undefined {
	if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
		return node.text;
	}
	return undefined;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports parseInt calls with binary, octal, or hexadecimal strings that can be replaced with numeric literals.",
		id: "numericLiteralParsing",
		preset: "stylistic",
	},
	messages: {
		preferLiteral: {
			primary: "Use {{ literal }} instead of parseInt with radix {{ radix }}.",
			secondary: [
				"Binary, octal, and hexadecimal numeric literals are more readable and direct than using parseInt with a radix.",
				"Numeric literals are supported natively and don't require function calls.",
			],
			suggestions: ["Replace the parseInt call with the numeric literal."],
		},
	},
	setup(context) {
		function checkParseIntCall(node: ts.CallExpression) {
			if (node.arguments.length !== 2) {
				return;
			}

			const [stringArg, radixArg] = node.arguments;
			const stringValue = getStringValue(stringArg);
			const radixValue = getRadixValue(radixArg);

			if (!stringValue || !radixValue) {
				return;
			}

			const literal = convertToLiteral(stringValue, radixValue);

			context.report({
				data: {
					literal,
					radix: String(radixValue),
				},
				message: "preferLiteral",
				range: getTSNodeRange(node, context.sourceFile),
			});
		}

		return {
			visitors: {
				CallExpression: (node) => {
					if (ts.isIdentifier(node.expression)) {
						if (node.expression.text === "parseInt") {
							checkParseIntCall(node);
						}
					} else if (ts.isPropertyAccessExpression(node.expression)) {
						if (
							ts.isIdentifier(node.expression.expression) &&
							node.expression.expression.text === "Number" &&
							ts.isIdentifier(node.expression.name) &&
							node.expression.name.text === "parseInt"
						) {
							checkParseIntCall(node);
						}
					}
				},
			},
		};
	},
});
