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

	return suffix.replace(/-([a-z])/g, (_match, letter: string) =>
		letter.toUpperCase(),
	);
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

					if (node.arguments.length === 0) {
						return;
					}

					const attributeName = getStringLiteralValue(node.arguments[0]);
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
						if (declarations) {
							const hasDomDeclaration = declarations.some((decl) => {
								const sourceFile = decl.getSourceFile();
								return sourceFile.fileName.includes("lib.dom");
							});
							if (!hasDomDeclaration) {
								return;
							}
						}
					}

					const sourceFile = context.sourceFile;
					const elementText = expression.getText(sourceFile);
					let current: string;
					let suggestion: string;

					if (methodName === "getAttribute") {
						current = `${elementText}.getAttribute('${attributeName}')`;
						suggestion = `${elementText}.dataset.${datasetKey}`;
					} else if (methodName === "hasAttribute") {
						current = `${elementText}.hasAttribute('${attributeName}')`;
						suggestion = `'${datasetKey}' in ${elementText}.dataset`;
					} else if (methodName === "removeAttribute") {
						current = `${elementText}.removeAttribute('${attributeName}')`;
						suggestion = `delete ${elementText}.dataset.${datasetKey}`;
					} else {
						// setAttribute
						if (node.arguments.length < 2) {
							return;
						}
						current = `${elementText}.setAttribute('${attributeName}', ...)`;
						suggestion = `${elementText}.dataset.${datasetKey} = ...`;
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
