import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

interface Ambiguity {
	data: {
		after: string;
		interpretation: string;
	};
	endNode: ts.Node;
	startNode: ts.Node;
}

function findAmbiguity(
	node: ts.Node,
	sourceFile: ts.SourceFile,
	rootExpression: ts.Expression,
): Ambiguity | undefined {
	const nested = ts.forEachChild(node, (child) => {
		return findAmbiguity(child, sourceFile, rootExpression);
	});
	if (nested) {
		return nested;
	}

	if (ts.isCallExpression(node)) {
		if (node.arguments.length) {
			return {
				data: {
					after: "parentheses",
					interpretation: "function call",
				},
				endNode: node.expression,
				startNode: node.arguments[0],
			};
		}
	} else if (ts.isElementAccessExpression(node)) {
		return {
			data: {
				after: "brackets",
				interpretation: "property access",
			},
			endNode: node.expression,
			startNode: node.argumentExpression,
		};
	} else if (ts.isTaggedTemplateExpression(node)) {
		return {
			data: {
				after: "a template literal",
				interpretation: "tagged template",
			},
			endNode: node.tag,
			startNode: node.template,
		};
	}
}

function getEndLineNumber(node: ts.Node, sourceFile: ts.SourceFile): number {
	return sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line;
}

function getFirstNonWhitespaceOnLine(
	lineNumber: number,
	sourceFile: ts.SourceFile,
): number {
	const lineStart = sourceFile.getPositionOfLineAndCharacter(lineNumber, 0);
	const text = sourceFile.getText();
	let start = lineStart;

	while (start < text.length && /\s+/.test(text[start])) {
		start++;
	}

	return start;
}

function getLineNumber(node: ts.Node, sourceFile: ts.SourceFile): number {
	return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
		.line;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports ambiguous multiline expressions that could be misinterpreted.",
		id: "multilineAmbiguities",
		preset: "stylistic",
	},
	messages: {
		ambiguity: {
			primary:
				"This ambiguous line break before {{ after }} will be misinterpreted as a {{ interpretation }}.",
			secondary: [
				"When a line ends with an expression and the next line starts with {{ after }}, it may be interpreted as a {{ interpretation }} instead of two separate statements.",
				"This can lead to unexpected behavior and runtime errors that are difficult to debug.",
			],
			suggestions: [
				"Add a semicolon after the first line to make it clear they are separate statements.",
				"Alternatively, move the {{ after }} to the same line as the first expression if a {{ interpretation }} is intended.",
			],
		},
	},
	setup(context) {
		function checkNode(node: ts.Expression, sourceFile: ts.SourceFile) {
			const ambiguity = findAmbiguity(node, context.sourceFile, node);
			if (!ambiguity) {
				return;
			}

			const endLine = getEndLineNumber(ambiguity.endNode, sourceFile);
			const startLine = getLineNumber(ambiguity.startNode, sourceFile);
			if (endLine >= startLine) {
				return;
			}

			context.report({
				data: ambiguity.data,
				message: "ambiguity",
				range: {
					begin: getFirstNonWhitespaceOnLine(startLine, sourceFile),
					end: node.getEnd(),
				},
			});
		}

		return {
			visitors: {
				ExpressionStatement: (node, { sourceFile }) => {
					if (ts.isExpressionStatement(node)) {
						checkNode(node.expression, sourceFile);
					}
				},
				VariableDeclaration: (node, { sourceFile }) => {
					if (node.initializer) {
						checkNode(node.initializer, sourceFile);
					}
				},
			},
		};
	},
});
