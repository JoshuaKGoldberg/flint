import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports generator functions that do not yield values.",
		id: "generatorFunctionYields",
		preset: "logical",
	},
	messages: {
		missingYield: {
			primary:
				"Generator functions must contain at least one yield expression to produce values.",
			secondary: [
				"Generator functions use the `function*` syntax to create iterators that can produce multiple values over time.",
				"Without a yield expression, the generator will not produce any values and behaves like an empty iterator.",
				"This is likely unintentional and indicates incomplete implementation or a misunderstanding of generator functions.",
			],
			suggestions: [
				"Add a `yield` expression to produce values from the generator.",
				"If the function should not be a generator, remove the asterisk (`*`) from the function declaration.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				FunctionDeclaration: checkFunction,
				FunctionExpression: checkFunction,
				MethodDeclaration: checkFunction,
			},
		};

		function checkFunction(
			node:
				| ts.FunctionDeclaration
				| ts.FunctionExpression
				| ts.MethodDeclaration,
		): void {
			if (!node.asteriskToken || !node.body || blockContainsYield(node.body)) {
				return;
			}

			context.report({
				message: "missingYield",
				range: {
					begin: node.asteriskToken.getStart(context.sourceFile),
					end: node.asteriskToken.getEnd(),
				},
			});
		}
	},
});

function blockContainsYield(block: ts.Block) {
	function checkForYield(node: ts.Node): boolean | undefined {
		if (ts.isYieldExpression(node)) {
			return true;
		}

		if (tsutils.isFunctionScopeBoundary(node)) {
			return false;
		}

		return ts.forEachChild(node, checkForYield);
	}

	return ts.forEachChild(block, checkForYield);
}
