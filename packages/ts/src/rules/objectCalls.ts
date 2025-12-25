import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";
import { isGlobalDeclaration } from "../utils/isGlobalDeclaration.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Use object literal notation {} or Object.create instead of calling or constructing Object.",
		id: "objectCalls",
		preset: "logical",
	},
	messages: {
		preferObjectLiteral: {
			primary:
				"Use object literal notation {} or Object.create instead of calling or constructing Object.",
			secondary: [
				"Calling or constructing Object with Object() or new Object() is unnecessarily verbose and less idiomatic than using object literal syntax.",
				"Object literal notation {} is the preferred and more concise way to create plain objects.",
				"For creating objects without a prototype, use Object.create(null).",
			],
			suggestions: [
				"Replace Object() or new Object() with {} to create an empty object.",
				"Use Object.create(null) when you need an object without a prototype.",
			],
		},
	},
	setup(context) {
		function checkObjectCall(node: ts.CallExpression | ts.NewExpression): void {
			if (
				!ts.isIdentifier(node.expression) ||
				node.expression.text !== "Object" ||
				!isGlobalDeclaration(node.expression, context.typeChecker)
			) {
				return;
			}

			const reportNode =
				node.kind === ts.SyntaxKind.NewExpression
					? node.getChildAt(0, context.sourceFile)
					: node.expression;

			context.report({
				message: "preferObjectLiteral",
				range: getTSNodeRange(reportNode, context.sourceFile),
			});
		}

		return {
			visitors: {
				CallExpression: checkObjectCall,
				NewExpression: checkObjectCall,
			},
		};
	},
});
