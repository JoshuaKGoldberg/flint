import { runtimeBase } from "@flint.fyi/core";
import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports standalone new expressions that don't use the constructed object.",
		id: "newExpressions",
		preset: "logical",
	},
	messages: {
		noStandaloneNew: {
			primary:
				"Constructors should only be called when their return value is used.",
			secondary: [
				"Using `new` to construct an object but not storing or using the result is often a mistake or indicates unclear code intent.",
				"If the constructor has side effects you want to trigger, it's better to make that explicit by calling a separate method rather than relying on constructor side effects.",
			],
			suggestions: [
				"If you need to use the constructed object, assign it to a variable or return it.",
				"If you only need the constructor's side effects, consider refactoring to a function that makes the side effects explicit.",
			],
		},
	},
	setup() {
		function isStandaloneExpression(node: ts.Node): boolean {
			const parent = node.parent;

			// If parent is an ExpressionStatement, it's standalone
			if (parent.kind === ts.SyntaxKind.ExpressionStatement) {
				return true;
			}

			// If parent is a comma expression, check recursively
			if (
				ts.isBinaryExpression(parent) &&
				parent.operatorToken.kind === ts.SyntaxKind.CommaToken
			) {
				// If this is the last expression in the comma sequence, check if the parent is standalone
				if (parent.right === node) {
					return isStandaloneExpression(parent);
				}
				return true;
			}

			return false;
		}

		return {
			...runtimeBase,
			visitors: {
				NewExpression: (node, context) => {
					if (isStandaloneExpression(node)) {
						context.report({
							message: "noStandaloneNew",
							range: getTSNodeRange(
								node.getChildAt(0, context.sourceFile),
								context.sourceFile,
							),
						});
					}
				},
			},
		};
	},
});
