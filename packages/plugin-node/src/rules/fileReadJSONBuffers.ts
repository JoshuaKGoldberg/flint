import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

function isUtf8EncodingString(value: unknown): boolean {
	if (typeof value !== "string") {
		return false;
	}

	const normalized = value.toLowerCase();
	return normalized === "utf8" || normalized === "utf-8";
}

function isUtf8Encoding(node: ts.Expression): boolean {
	if (ts.isStringLiteral(node)) {
		return isUtf8EncodingString(node.text);
	}

	if (ts.isObjectLiteralExpression(node)) {
		if (node.properties.length !== 1) {
			return false;
		}

		const property = node.properties[0];
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

function getReadFileCall(
	node: ts.Expression,
	visited: Set<ts.Node>,
): ts.CallExpression | undefined {
	if (visited.has(node)) {
		return undefined;
	}
	visited.add(node);

	if (ts.isAwaitExpression(node)) {
		return getReadFileCall(node.expression, visited);
	}

	if (ts.isCallExpression(node)) {
		return node;
	}

	if (ts.isIdentifier(node)) {
		const symbol = node
			.getSourceFile()
			.locals?.get(node.escapedText as ts.__String);
		if (!symbol || !symbol.valueDeclaration) {
			return undefined;
		}

		if (ts.isVariableDeclaration(symbol.valueDeclaration)) {
			const initializer = symbol.valueDeclaration.initializer;
			if (initializer) {
				return getReadFileCall(initializer, visited);
			}
		}
	}

	return undefined;
}

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
				CallExpression(node: ts.CallExpression) {
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

					const argument = node.arguments[0];
					if (!argument || ts.isSpreadElement(argument)) {
						return;
					}

					const visited = new Set<ts.Node>();
					const readFileCall = getReadFileCall(argument, visited);
					if (
						!readFileCall ||
						!ts.isPropertyAccessExpression(readFileCall.expression) ||
						!ts.isIdentifier(readFileCall.expression.name)
					) {
						return;
					}

					const methodName = readFileCall.expression.name.text;
					if (methodName !== "readFile" && methodName !== "readFileSync") {
						return;
					}

					if (readFileCall.arguments.length !== 2) {
						return;
					}

					const encodingArg = readFileCall.arguments[1];
					if (!encodingArg || ts.isSpreadElement(encodingArg)) {
						return;
					}

					if (!isUtf8Encoding(encodingArg)) {
						return;
					}

					context.report({
						message: "preferBufferReading",
						range: getTSNodeRange(encodingArg, context.sourceFile),
					});
				},
			},
		};
	},
});
