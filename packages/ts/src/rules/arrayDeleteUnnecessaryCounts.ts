import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";
import { hasSameTokens } from "../utils/hasSameTokens.ts";

function isUnnecessaryCountArgument(
	argument: ts.Expression,
	calleeObject: ts.Expression,
	sourceFile: ts.SourceFile,
): string | undefined {
	if (ts.isIdentifier(argument) && argument.text === "Infinity") {
		return "`Infinity`";
	}

	if (
		ts.isPropertyAccessExpression(argument) &&
		ts.isIdentifier(argument.expression) &&
		argument.expression.text === "Number" &&
		ts.isIdentifier(argument.name) &&
		argument.name.text === "POSITIVE_INFINITY"
	) {
		return "`Number.POSITIVE_INFINITY`";
	}

	if (ts.isParenthesizedExpression(argument)) {
		return isUnnecessaryCountArgument(
			argument.expression,
			calleeObject,
			sourceFile,
		);
	}

	if (
		ts.isPropertyAccessExpression(argument) &&
		ts.isIdentifier(argument.name) &&
		argument.name.text === "length" &&
		hasSameTokens(argument.expression, calleeObject, sourceFile)
	) {
		const objectText = ts.isIdentifier(calleeObject) ? calleeObject.text : "…";
		const optionalChain = argument.questionDotToken ? "?." : ".";
		return `\`${objectText}${optionalChain}length\``;
	}

	return undefined;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using `.length` or `Infinity` as the `deleteCount` or `skipCount` argument of `Array#splice()` or `Array#toSpliced()`.",
		id: "arrayDeleteUnnecessaryCounts",
		preset: "stylistic",
	},
	messages: {
		unnecessaryCount: {
			primary:
				"Passing {{ description }} as the {{ argumentName }} argument is unnecessary.",
			secondary: [
				"When calling `splice` or `toSpliced`, omitting the second argument will delete or skip all elements after the start index.",
				"Using `.length` or `Infinity` is redundant and makes the code less clear.",
			],
			suggestions: ["Omit the second argument to achieve the same result."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile }) => {
					if (
						!ts.isPropertyAccessExpression(node.expression) ||
						!ts.isIdentifier(node.expression.name)
					) {
						return;
					}

					const methodName = node.expression.name.text;
					if (methodName !== "splice" && methodName !== "toSpliced") {
						return;
					}

					if (node.arguments.length !== 2) {
						return;
					}

					const firstArg = node.arguments[0];
					const secondArg = node.arguments[1];

					if (!firstArg || !secondArg) {
						return;
					}

					if (ts.isSpreadElement(firstArg) || ts.isSpreadElement(secondArg)) {
						return;
					}

					const calleeObject = node.expression.expression;
					const description = isUnnecessaryCountArgument(
						secondArg,
						calleeObject,
						sourceFile,
					);

					if (!description) {
						return;
					}

					const argumentName =
						methodName === "splice" ? "`deleteCount`" : "`skipCount`";

					context.report({
						data: { argumentName, description },
						message: "unnecessaryCount",
						range: getTSNodeRange(secondArg, sourceFile),
					});
				},
			},
		};
	},
});
