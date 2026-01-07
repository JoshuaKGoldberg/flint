import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using the `Array` constructor to create arrays instead of array literal syntax.",
		id: "arrayConstructors",
		preset: "logical",
	},
	messages: {
		preferLiteral: {
			primary: "Prefer array literal syntax over the `Array` constructor.",
			secondary: [
				"The `Array` constructor has confusing behavior with a single numeric argument, creating a sparse array instead of an array containing that number.",
				"Array literal syntax is clearer and avoids potential pitfalls.",
			],
			suggestions: ["Use array literal syntax like `[]` or `[1, 2, 3]`."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile }) => {
					if (!isArrayConstructorCall(node)) {
						return;
					}

					if (shouldAllowCall(node)) {
						return;
					}

					context.report({
						fix: createFix(node, sourceFile),
						message: "preferLiteral",
						range: {
							begin: node.getStart(sourceFile),
							end: node.getEnd(),
						},
					});
				},
				NewExpression: (node, { sourceFile }) => {
					if (!isArrayConstructorNew(node)) {
						return;
					}

					if (shouldAllowNew(node)) {
						return;
					}

					context.report({
						fix: createFix(node, sourceFile),
						message: "preferLiteral",
						range: {
							begin: node.getStart(sourceFile),
							end: node.getEnd(),
						},
					});
				},
			},
		};
	},
});

function createFix(
	node: ts.CallExpression | ts.NewExpression,
	sourceFile: ts.SourceFile,
) {
	const args = node.arguments ?? [];
	const argsText = args.map((arg) => arg.getText(sourceFile)).join(", ");

	return {
		range: {
			begin: node.getStart(sourceFile),
			end: node.getEnd(),
		},
		text: `[${argsText}]`,
	};
}

function isArrayConstructorCall(node: ts.CallExpression) {
	return ts.isIdentifier(node.expression) && node.expression.text === "Array";
}

function isArrayConstructorNew(node: ts.NewExpression) {
	return ts.isIdentifier(node.expression) && node.expression.text === "Array";
}

function shouldAllowCall(node: ts.CallExpression) {
	if (node.typeArguments && node.typeArguments.length > 0) {
		return true;
	}

	if (node.arguments.length === 1 && ts.isNumericLiteral(node.arguments[0])) {
		return true;
	}

	return false;
}

function shouldAllowNew(node: ts.NewExpression) {
	if (node.typeArguments && node.typeArguments.length > 0) {
		return true;
	}

	const args = node.arguments ?? [];
	if (args.length === 1 && ts.isNumericLiteral(args[0])) {
		return true;
	}

	return false;
}
