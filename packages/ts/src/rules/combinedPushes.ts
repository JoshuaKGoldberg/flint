import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

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
		return {
			visitors: {
				ExpressionStatement: (node, { sourceFile }) => {
					checkForConsecutivePushes(node, context, sourceFile);
				},
			},
		};
	},
});

function checkForConsecutivePushes(
	statement: ts.ExpressionStatement,
	context: any,
	sourceFile: ts.SourceFile,
): void {
	const parent = statement.parent;
	if (!ts.isBlock(parent)) {
		return;
	}

	const statements = parent.statements;
	const index = statements.indexOf(statement);
	if (index === -1) {
		return;
	}

	const firstCall = getPushCallInfo(statement.expression);
	if (!firstCall) {
		return;
	}

	let consecutiveCount = 0;
	let currentIndex = index + 1;

	while (currentIndex < statements.length) {
		const nextStatement = statements[currentIndex];
		if (!ts.isExpressionStatement(nextStatement)) {
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
		context.report({
			message: "combinePushes",
			range: {
				begin: statement.getStart(sourceFile),
				end:
					statements[index + consecutiveCount].getStart(sourceFile) -
					(statements[index + consecutiveCount].getLeadingTriviaWidth
						? statements[index + consecutiveCount].getLeadingTriviaWidth(
								sourceFile,
							)
						: 0),
			},
		});
	}
}

interface PushCallInfo {
	object: string;
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

	const objectName = getObjectIdentifierName(member.object);
	if (!objectName) {
		return undefined;
	}

	return { object: objectName };
}

function getObjectIdentifierName(node: ts.Expression): string | undefined {
	if (ts.isIdentifier(node)) {
		return node.text;
	}

	if (ts.isPropertyAccessExpression(node)) {
		const parent = getObjectIdentifierName(node.object);
		if (!parent) {
			return undefined;
		}
		return `${parent}.${node.name.text}`;
	}

	return undefined;
}
