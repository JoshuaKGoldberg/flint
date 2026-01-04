import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import {
	typescriptLanguage,
	type TypeScriptFileServices,
} from "../language.ts";
import { isGlobalDeclarationOfName } from "../utils/isGlobalDeclarationOfName.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer `{}` object literal notation or `Object.create` instead of calling or constructing `Object`.",
		id: "objectCalls",
		preset: "stylistic",
	},
	messages: {
		preferObjectLiteral: {
			primary:
				"Prefer directly using `{}` instead of calling or constructing `Object`.",
			secondary: [
				"Calling or constructing Object with `Object()` or `new Object()` is unnecessarily verbose and less idiomatic than using object literal syntax.",
				"`{}` object literal notation is the preferred and more concise way to create plain objects.",
				"For creating objects without a prototype, use `Object.create(null)`.",
			],
			suggestions: [
				"Replace `Object()` or `new Object()` with `{}` to create an empty object.",
				"Use `Object.create(null)` when you need an object without a prototype.",
			],
		},
	},
	setup(context) {
		function checkNode(
			node: ts.CallExpression | ts.NewExpression,
			{ sourceFile, typeChecker }: TypeScriptFileServices,
		): void {
			if (
				!ts.isIdentifier(node.expression) ||
				!isGlobalDeclarationOfName(node.expression, "Object", typeChecker)
			) {
				return;
			}

			const reportNode =
				node.kind === ts.SyntaxKind.NewExpression
					? node.getChildAt(0, sourceFile)
					: node.expression;

			context.report({
				message: "preferObjectLiteral",
				range: getTSNodeRange(reportNode, sourceFile),
			});
		}

		return {
			visitors: {
				CallExpression: checkNode,
				NewExpression: checkNode,
			},
		};
	},
});
