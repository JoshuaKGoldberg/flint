import {
	getTSNodeRange,
	isGlobalDeclaration,
	typescriptLanguage,
} from "@flint.fyi/ts";
import { nullThrows } from "@flint.fyi/utils";
import * as ts from "typescript";

type AttributeMethodName =
	| "getAttribute"
	| "hasAttribute"
	| "removeAttribute"
	| "setAttribute";

function convertDataAttributeToDatasetKey(
	attributeName: string,
): string | undefined {
	return attributeName.startsWith("data-")
		? attributeName
				.slice(5)
				.replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase())
		: undefined;
}

function getMethodDetails(node: ts.CallExpression) {
	if (
		node.arguments.length === 0 ||
		!ts.isPropertyAccessExpression(node.expression) ||
		!ts.isIdentifier(node.expression.name)
	) {
		return undefined;
	}

	const methodName = node.expression.name.text;
	if (!isAttributeMethodName(methodName)) {
		return undefined;
	}

	return {
		methodName,
		methodNode: node.expression.name,
	};
}

const attributeMethodNames = new Set([
	"getAttribute",
	"hasAttribute",
	"removeAttribute",
	"setAttribute",
]);

function isAttributeMethodName(
	methodName: string,
): methodName is AttributeMethodName {
	return attributeMethodNames.has(methodName);
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer using element.dataset over getAttribute/setAttribute for data-* attributes.",
		id: "nodeDatasetAttributes",
		preset: "logical",
	},
	messages: {
		preferDataset: {
			primary:
				"Prefer using `.dataset` as a safer, more idiomatic API for accessing data-* attributes.",
			secondary: [
				"The `dataset` property automatically handles the conversion between kebab-case attribute names and camelCase property names.",
				"It is generally considered preferable and less danger-prone than legacy methods for data-* attribute manipulation.",
			],
			suggestions: ["Use the `dataset` property instead."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node: ts.CallExpression, { sourceFile, typeChecker }) {
					const details = getMethodDetails(node);
					if (!details) {
						return;
					}

					const attributeName = getStringLiteralValue(
						nullThrows(
							node.arguments[0],
							"First argument is expected to be present by prior length check",
						),
					);
					if (!attributeName) {
						return;
					}

					const datasetKey = convertDataAttributeToDatasetKey(attributeName);
					if (!datasetKey) {
						return;
					}

					if (!isGlobalDeclaration(node.expression, typeChecker)) {
						return;
					}

					context.report({
						message: "preferDataset",
						range: getTSNodeRange(details.methodNode, sourceFile),
						// TODO: add an automated changer
					});
				},
			},
		};
	},
});

// TODO: Use a util like getStaticValue
// https://github.com/flint-fyi/flint/issues/1298
function getStringLiteralValue(node: ts.Expression): string | undefined {
	if (ts.isStringLiteral(node)) {
		return node.text;
	}

	if (
		ts.isNoSubstitutionTemplateLiteral(node) &&
		!ts.isTaggedTemplateExpression(node.parent)
	) {
		return node.text;
	}

	return undefined;
}
