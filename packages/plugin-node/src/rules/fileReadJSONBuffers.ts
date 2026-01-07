import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import { nullThrows } from "@flint.fyi/utils";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer reading JSON files as buffers when using JSON.parse for better performance.",
		id: "fileReadJSONBuffers",
		preset: "stylistic",
	},
	messages: {
		preferBufferReading: {
			primary:
				"Prefer reading the JSON file as a buffer instead of specifying UTF-8 encoding.",
			secondary: [
				"`JSON.parse()` can parse buffers directly without needing to convert them to strings first.",
				"Reading files as buffers when parsing JSON avoids unnecessary string conversion overhead.",
			],
			suggestions: ["Remove the encoding argument from the file reading call"],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node, { sourceFile }) {
					if (
						!ts.isPropertyAccessExpression(node.expression) ||
						!ts.isIdentifier(node.expression.expression) ||
						node.expression.expression.text !== "JSON" ||
						!ts.isIdentifier(node.expression.name) ||
						node.expression.name.text !== "parse" ||
						node.arguments.length !== 1
					) {
						return;
					}

					const argument = unwrapAwaitExpression(
						nullThrows(
							node.arguments[0],
							"First argument is expected to be present by prior length check",
						),
					);
					if (
						ts.isSpreadElement(argument) ||
						!isReadFileCall(argument) ||
						argument.arguments.length !== 2
					) {
						return;
					}

					const encoding = nullThrows(
						argument.arguments[1],
						"Second argument is expected to be present by prior length check",
					);
					if (ts.isSpreadElement(encoding) || !isUtf8Encoding(encoding)) {
						return;
					}

					context.report({
						message: "preferBufferReading",
						range: getTSNodeRange(encoding, sourceFile),
					});
				},
			},
		};
	},
});

function isReadFileCall(node: ts.Expression): node is ts.CallExpression {
	return (
		ts.isCallExpression(node) &&
		ts.isPropertyAccessExpression(node.expression) &&
		ts.isIdentifier(node.expression.expression) &&
		node.expression.expression.text === "fs" &&
		ts.isIdentifier(node.expression.name) &&
		/^readFile(?:Sync)?$/.test(node.expression.name.text)
	);
}

function isUtf8Encoding(node: ts.Expression): boolean {
	if (ts.isStringLiteral(node)) {
		return isUtf8EncodingString(node.text);
	}

	if (ts.isObjectLiteralExpression(node)) {
		if (node.properties.length !== 1) {
			return false;
		}

		const property = nullThrows(
			node.properties[0],
			"First property is expected to be present by prior length check",
		);
		if (
			!ts.isPropertyAssignment(property) ||
			!ts.isIdentifier(property.name) ||
			property.name.text !== "encoding"
		) {
			return false;
		}

		if (ts.isStringLiteral(property.initializer)) {
			return isUtf8EncodingString(property.initializer.text);
		}
	}

	return false;
}

function isUtf8EncodingString(value: unknown): boolean {
	return typeof value === "string" && /utf-?8/i.test(value);
}

function unwrapAwaitExpression(node: ts.Expression): ts.Expression {
	while (ts.isAwaitExpression(node)) {
		node = node.expression;
	}
	return node;
}
