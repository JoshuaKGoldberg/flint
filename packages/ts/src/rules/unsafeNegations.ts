import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";
import { unwrapParenthesizedExpression } from "../utils/unwrapParenthesizedExpression.js";

const operatorStrings = new Map([
	[ts.SyntaxKind.InKeyword, "in"],
	[ts.SyntaxKind.InstanceOfKeyword, "instanceof"],
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports negating the left operand of `in` or `instanceof` relations.",
		id: "unsafeNegations",
		preset: "untyped",
	},
	messages: {
		preferNegatingRelation: {
			primary: "This negation applies before the `{{ operator }}` operator.",
			secondary: [
				"The logical not operator (!) has higher precedence than `in` and `instanceof`.",
				"Write `!(left in right)` or `!(left instanceof Right)` to negate the relation as intended.",
			],
			suggestions: ["Wrap the relation in parentheses and negate it."],
		},
	},
	setup(context) {
		return {
			visitors: {
				BinaryExpression: (node) => {
					const operator = operatorStrings.get(node.operatorToken.kind);
					if (!operator) {
						return;
					}

					const left = unwrapParenthesizedExpression(node.left);
					if (
						!ts.isPrefixUnaryExpression(left) ||
						left.operator !== ts.SyntaxKind.ExclamationToken
					) {
						return;
					}

					const begin = left.getStart(context.sourceFile);

					context.report({
						data: { operator },
						message: "preferNegatingRelation",
						range: {
							begin,
							end: begin + 1,
						},
					});
				},
			},
		};
	},
});
