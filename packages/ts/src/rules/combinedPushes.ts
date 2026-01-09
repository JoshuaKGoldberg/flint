import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

interface PushCallInfo {
	object: string;
}

function getObjectIdentifierName(node: ts.Expression): string | undefined {
	if (ts.isIdentifier(node)) {
		return node.text;
	}

	if (ts.isPropertyAccessExpression(node)) {
		const parent = getObjectIdentifierName(node.expression);
		if (!parent) {
			return undefined;
		}
		return `${parent}.${node.name.text}`;
	}

	return undefined;
}

function getPushCallInfo(expression: ts.Expression): PushCallInfo | undefined {
	if (!ts.isCallExpression(expression)) {
		return undefined;
	}

	const member = expression.expression;
	if (!ts.isPropertyAccessExpression(member)) {
		return undefined;
	}

	if (!ts.isIdentifier(member.name) || member.name.text !== "push") {
		return undefined;
	}

	const objectName = getObjectIdentifierName(member.expression);
	if (!objectName) {
		return undefined;
	}

	return { object: objectName };
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports multiple consecutive `Array.push()` calls that could be combined into a single call with multiple arguments.",
		id: "combinedPushes",
		preset: "stylistic",
		strictness: "strict",
	},
	messages: {
		combinePushes: {
			primary: "Multiple consecutive `push()` calls can be combined into one.",
			secondary: [
				"Combining multiple push calls improves code readability and performance.",
				"Instead of calling push multiple times, pass all values to a single call.",
			],
			suggestions: [
				"Combine the consecutive push calls into one with multiple arguments.",
			],
		},
	},
	setup(context) {
		const reportedStatements = new WeakSet<ts.Node>();

		return {
			visitors: {
				ExpressionStatement: (node, { sourceFile }) => {
					if (reportedStatements.has(node)) {
						return;
					}
					const parent = node.parent;
					if (!ts.isBlock(parent) && !ts.isSourceFile(parent)) {
						return;
					}

					const statements = parent.statements as ts.NodeArray<ts.Statement>;
					let index = -1;
					for (let i = 0; i < statements.length; i++) {
						if (statements[i] === node) {
							index = i;
							break;
						}
					}
					if (index === -1) {
						return;
					}

					const firstCall = getPushCallInfo(node.expression);
					if (!firstCall) {
						return;
					}

					// Check if the previous statement is also a push to the same array
					// If so, this is not the first in the sequence, so skip it
					if (index > 0) {
						const prevStatement = statements[index - 1];
						if (ts.isExpressionStatement(prevStatement)) {
							const prevCall = getPushCallInfo(prevStatement.expression);
							if (prevCall && prevCall.object === firstCall.object) {
								return;
							}
						}
					}

					let consecutiveCount = 0;
					let currentIndex = index + 1;

					while (currentIndex < statements.length) {
						const nextStatement = statements[currentIndex];
						if (!ts.isExpressionStatement(nextStatement)) {
							break;
						}

						// Check if there are comments or blank lines between this statement and the previous one
						const prevEnd = statements[currentIndex - 1].getEnd();
						const nextStart = nextStatement.getStart(sourceFile);
						const textBetween = sourceFile.text.slice(prevEnd, nextStart);
						if (/\/\/|\/\*|\n\s*\n/.test(textBetween)) {
							break;
						}

						const nextCall = getPushCallInfo(nextStatement.expression);
						if (!nextCall || nextCall.object !== firstCall.object) {
							break;
						}

						consecutiveCount++;
						currentIndex++;
					}

					if (consecutiveCount >= 1) {
						const lastStatement = statements[index + consecutiveCount];

						// Mark all consecutive statements as reported so we don't process them again
						for (let i = index; i <= index + consecutiveCount; i++) {
							reportedStatements.add(statements[i]);
						}

						context.report({
							message: "combinePushes",
							range: {
								begin: node.getStart(sourceFile),
								end: lastStatement.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
