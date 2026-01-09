import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

function getPropertyName(expression: ts.LeftHandSideExpression) {
	if (!ts.isPropertyAccessExpression(expression)) {
		return undefined;
	}

	if (expression.expression.kind !== ts.SyntaxKind.ThisKeyword) {
		return undefined;
	}

	return expression.name.text;
}

function isStaticValue(node: ts.Expression): boolean {
	if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
		return true;
	}

	if (
		node.kind === ts.SyntaxKind.TrueKeyword ||
		node.kind === ts.SyntaxKind.FalseKeyword ||
		node.kind === ts.SyntaxKind.NullKeyword
	) {
		return true;
	}

	if (ts.isArrayLiteralExpression(node)) {
		return node.elements.every(
			(element) => !ts.isSpreadElement(element) && isStaticValue(element),
		);
	}

	if (ts.isObjectLiteralExpression(node)) {
		return node.properties.every((property) => {
			if (ts.isPropertyAssignment(property)) {
				return isStaticValue(property.initializer);
			}
			return false;
		});
	}

	if (ts.isTemplateExpression(node)) {
		return node.templateSpans.every((span) => isStaticValue(span.expression));
	}

	if (ts.isNoSubstitutionTemplateLiteral(node)) {
		return true;
	}

	return false;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer class field declarations over property assignments in constructors.",
		id: "classFieldDeclarations",
		preset: "untyped",
	},
	messages: {
		preferClassField: {
			primary:
				"Prefer declaring this property as a class field instead of assigning in the constructor.",
			secondary: [
				"Class field declarations are more concise and make the class structure more visible.",
				"They also allow TypeScript to infer the property type without explicit annotation.",
			],
			suggestions: [
				"Move this property assignment to a class field declaration.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				Constructor: (node, { sourceFile }) => {
					if (!node.body) {
						return;
					}

					const classDeclaration = node.parent;
					if (
						!ts.isClassDeclaration(classDeclaration) &&
						!ts.isClassExpression(classDeclaration)
					) {
						return;
					}

					const existingFields = new Set<string>();
					for (const member of classDeclaration.members) {
						if (
							ts.isPropertyDeclaration(member) &&
							ts.isIdentifier(member.name)
						) {
							existingFields.add(member.name.text);
						}
					}

					for (const statement of node.body.statements) {
						if (!ts.isExpressionStatement(statement)) {
							continue;
						}

						if (!ts.isBinaryExpression(statement.expression)) {
							continue;
						}

						const { left, operatorToken, right } = statement.expression;

						if (operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
							continue;
						}

						const propertyName = getPropertyName(left);
						if (!propertyName) {
							continue;
						}

						if (!isStaticValue(right)) {
							continue;
						}

						if (existingFields.has(propertyName)) {
							continue;
						}

						context.report({
							message: "preferClassField",
							range: {
								begin: statement.getStart(sourceFile),
								end: statement.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
