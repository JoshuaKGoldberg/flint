import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";
import { hasSameTokens } from "../utils/hasSameTokens.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Prefer logical assignment operator shorthand expressions.",
		id: "assignmentOperatorShorthands",
		preset: "stylistic",
	},
	messages: {
		preferAndShorthand: {
			primary: "Prefer the logical assignment operator shorthand `&&=`.",
			secondary: [
				"Logical assignment operators are more concise and express the intent more clearly.",
				"They were introduced in ES2021 and are supported in all modern environments.",
			],
			suggestions: ["Use the shorthand operator `&&=`."],
		},
		preferNullishShorthand: {
			primary: "Prefer the logical assignment operator shorthand `??=`.",
			secondary: [
				"Logical assignment operators are more concise and express the intent more clearly.",
				"They were introduced in ES2021 and are supported in all modern environments.",
			],
			suggestions: ["Use the shorthand operator `??=`."],
		},
		preferOrShorthand: {
			primary: "Prefer the logical assignment operator shorthand `||=`.",
			secondary: [
				"Logical assignment operators are more concise and express the intent more clearly.",
				"They were introduced in ES2021 and are supported in all modern environments.",
			],
			suggestions: ["Use the shorthand operator `||=`."],
		},
	},
	setup(context) {
		function getOperatorInfo(kind: ts.SyntaxKind) {
			switch (kind) {
				case ts.SyntaxKind.AmpersandAmpersandToken:
					return { message: "preferAndShorthand", shorthand: "&&=" } as const;
				case ts.SyntaxKind.BarBarToken:
					return { message: "preferOrShorthand", shorthand: "||=" } as const;
				case ts.SyntaxKind.QuestionQuestionToken:
					return {
						message: "preferNullishShorthand",
						shorthand: "??=",
					} as const;
				default:
					return undefined;
			}
		}

		return {
			visitors: {
				BinaryExpression: (node, { sourceFile }) => {
					if (node.operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
						return;
					}

					if (!ts.isBinaryExpression(node.right)) {
						return;
					}

					const operatorInfo = getOperatorInfo(node.right.operatorToken.kind);
					if (!operatorInfo) {
						return;
					}

					if (!hasSameTokens(node.left, node.right.left, sourceFile)) {
						return;
					}

					const range = {
						begin: node.getStart(sourceFile),
						end: node.getEnd(),
					};

					const leftText = node.left.getText(sourceFile);
					const rightText = node.right.right.getText(sourceFile);
					const fixedText = `${leftText} ${operatorInfo.shorthand} ${rightText}`;

					context.report({
						fix: {
							range,
							text: fixedText,
						},
						message: operatorInfo.message,
						range,
					});
				},
			},
		};
	},
});
