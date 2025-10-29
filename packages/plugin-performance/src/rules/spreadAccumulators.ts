import { typescriptLanguage } from "@flint.fyi/ts";
import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports spread operations that accumulate values in loops, causing quadratic time complexity.",
		id: "spreadAccumulators",
	},
	messages: {
		noAccumulatingSpread: {
			primary:
				"Using spread operations to accumulate values in loops causes quadratic time complexity.",
			secondary: [
				"Each iteration creates a new array or object by copying all previous elements, resulting in O(n²) time complexity.",
				"This can significantly slow down your code as the accumulated collection grows.",
			],
			suggestions: [
				"For arrays, use `.push()` method instead of spreading.",
				"For objects, use direct property assignment or `Object.assign()`.",
			],
		},
	},
	setup(context) {
		function getIdentifierName(node: ts.Node): string | undefined {
			if (ts.isIdentifier(node)) {
				return node.text;
			}
			return undefined;
		}

		function hasSpreadOfIdentifier(
			node: ts.Node,
			identifierName: string,
		): boolean {
			if (ts.isSpreadElement(node) || ts.isSpreadAssignment(node)) {
				const spreadName = getIdentifierName(node.expression);
				if (spreadName === identifierName) {
					return true;
				}
			}

			let found = false;
			ts.forEachChild(node, (child) => {
				if (hasSpreadOfIdentifier(child, identifierName)) {
					found = true;
				}
			});

			return found;
		}

		function checkAssignmentInLoop(node: ts.Node): void {
			if (
				ts.isBinaryExpression(node) &&
				node.operatorToken.kind === ts.SyntaxKind.EqualsToken
			) {
				const leftName = getIdentifierName(node.left);
				if (leftName && hasSpreadOfIdentifier(node.right, leftName)) {
					const spreadNode = findSpreadElement(node.right, leftName);
					if (spreadNode) {
						const firstToken = spreadNode.getFirstToken(context.sourceFile);
						if (
							firstToken &&
							firstToken.kind === ts.SyntaxKind.DotDotDotToken
						) {
							const start = firstToken.getStart(context.sourceFile);
							context.report({
								message: "noAccumulatingSpread",
								range: {
									begin: start,
									end: start + "...".length,
								},
							});
						}
					}
				}
			}

			ts.forEachChild(node, (child) => {
				if (
					ts.isDoStatement(child) ||
					ts.isForInStatement(child) ||
					ts.isForOfStatement(child) ||
					ts.isForStatement(child) ||
					ts.isWhileStatement(child) ||
					tsutils.isFunctionScopeBoundary(child)
				) {
					return;
				}
				checkAssignmentInLoop(child);
			});
		}

		function findSpreadElement(
			node: ts.Node,
			identifierName: string,
		): ts.Node | undefined {
			if (ts.isSpreadElement(node) || ts.isSpreadAssignment(node)) {
				const spreadName = getIdentifierName(node.expression);
				if (spreadName === identifierName) {
					return node;
				}
			}

			let result: ts.Node | undefined = undefined;
			ts.forEachChild(node, (child) => {
				if (!result) {
					result = findSpreadElement(child, identifierName);
				}
			});

			return result;
		}

		function checkLoopStatement(node: ts.Node & { statement: ts.Node }) {
			checkAssignmentInLoop(node.statement);
		}

		return {
			visitors: {
				DoStatement: checkLoopStatement,
				ForInStatement: checkLoopStatement,
				ForOfStatement: checkLoopStatement,
				ForStatement: checkLoopStatement,
				WhileStatement: checkLoopStatement,
			},
		};
	},
});
