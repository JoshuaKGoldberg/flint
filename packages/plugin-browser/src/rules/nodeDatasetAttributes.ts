import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

function convertDataAttributeToDatasetKey(
	attributeName: string,
): string | undefined {
	if (!attributeName.startsWith("data-")) {
		return undefined;
	}

	const suffix = attributeName.slice(5);
	if (suffix.length === 0) {
		return undefined;
	}

	return suffix.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function getMethodDetails(node: ts.CallExpression) {
	if (!ts.isPropertyAccessExpression(node.expression)) {
		return undefined;
	}

	const { expression, name } = node.expression;
	if (!ts.isIdentifier(name)) {
		return undefined;
	}

	const methodName = name.text;
	if (
		methodName !== "getAttribute" &&
		methodName !== "setAttribute" &&
		methodName !== "removeAttribute" &&
		methodName !== "hasAttribute"
	) {
		return undefined;
	}

	return { expression, methodName, methodNode: name };
}

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

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer using element.dataset over getAttribute/setAttribute for data-* attributes.",
		id: "nodeDatasetAttributes",
		preset: "logical",
	},
	messages: {
		preferDataset: {
			primary: "Prefer `{{ suggestion }}` over `{{ current }}`.",
			secondary: [
				"The `dataset` property provides a cleaner and more convenient API for accessing data-* attributes.",
				"It automatically handles the conversion between kebab-case attribute names and camelCase property names.",
			],
			suggestions: ["Use the `dataset` property instead."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node: ts.CallExpression) {
					const details = getMethodDetails(node);
					if (!details) {
						return;
					}

					const { expression, methodName, methodNode } = details;

					const [firstArg, secondArg] = node.arguments;
					if (!firstArg) {
						return;
					}

					const attributeName = getStringLiteralValue(firstArg);
					if (!attributeName) {
						return;
					}

					const datasetKey = convertDataAttributeToDatasetKey(attributeName);
					if (!datasetKey) {
						return;
					}

					// Check if the method is from a DOM element type
					const type = context.typeChecker.getTypeAtLocation(expression);
					const symbol = type.getSymbol();
					if (symbol) {
						const declarations = symbol.getDeclarations();
						if (
							declarations &&
							declarations.length > 0 &&
							!declarations.some((decl) => {
								const sourceFile = decl.getSourceFile();
								return sourceFile.fileName.includes("lib.dom");
							})
						) {
							return;
						}
					}

					const sourceFile = context.sourceFile;
					const elementText = expression.getText(sourceFile);
					let current: string;
					let suggestion: string;

					switch (methodName) {
						case "getAttribute":
							current = `${elementText}.getAttribute('${attributeName}')`;
							suggestion = `${elementText}.dataset.${datasetKey}`;
							break;
						case "setAttribute":
							if (!secondArg) {
								return;
							}
							current = `${elementText}.setAttribute('${attributeName}', ...)`;
							suggestion = `${elementText}.dataset.${datasetKey} = ...`;
							break;
						case "removeAttribute":
							current = `${elementText}.removeAttribute('${attributeName}')`;
							suggestion = `delete ${elementText}.dataset.${datasetKey}`;
							break;
						case "hasAttribute":
							current = `${elementText}.hasAttribute('${attributeName}')`;
							suggestion = `'${datasetKey}' in ${elementText}.dataset`;
							break;
					}

					context.report({
						data: { current, suggestion },
						message: "preferDataset",
						range: getTSNodeRange(methodNode, sourceFile),
					});
				},
			},
		};
	},
});
