import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

interface AmbiguityResult {
	message: "unexpectedCall" | "unexpectedProperty" | "unexpectedTemplate";
	rangeEnd: number;
	rangeStart: number;
}

function findAmbiguousExpression(
	node: ts.Node,
	sourceFile: ts.SourceFile,
	rootExpression: ts.Expression,
): AmbiguityResult | undefined {
	// Check if this node itself is ambiguous
	if (ts.isCallExpression(node) && node.arguments.length > 0) {
		const calleeEndLine = getEndLineNumber(node.expression, sourceFile);
		const argsStartLine = getLineNumber(node.arguments[0], sourceFile);

		if (calleeEndLine < argsStartLine) {
			// Report from the first non-whitespace character on the line where the ambiguity begins
			const lineStart = getFirstNonWhitespaceOnLine(argsStartLine, sourceFile);

			return {
				message: "unexpectedCall",
				rangeEnd: rootExpression.getEnd(),
				rangeStart: lineStart,
			};
		}
	}

	if (ts.isElementAccessExpression(node)) {
		const objectEndLine = getEndLineNumber(node.expression, sourceFile);
		const indexStartLine = getLineNumber(node.argumentExpression, sourceFile);

		if (objectEndLine < indexStartLine) {
			// Report from the first non-whitespace character on the line where the ambiguity begins
			const lineStart = getFirstNonWhitespaceOnLine(indexStartLine, sourceFile);

			return {
				message: "unexpectedProperty",
				rangeEnd: rootExpression.getEnd(),
				rangeStart: lineStart,
			};
		}
	}

	if (ts.isTaggedTemplateExpression(node)) {
		const tagEndLine = getEndLineNumber(node.tag, sourceFile);
		const templateStartLine = getLineNumber(node.template, sourceFile);

		if (tagEndLine < templateStartLine) {
			// Report from the first non-whitespace character on the line where the ambiguity begins
			const lineStart = getFirstNonWhitespaceOnLine(
				templateStartLine,
				sourceFile,
			);

			return {
				message: "unexpectedTemplate",
				rangeEnd: rootExpression.getEnd(),
				rangeStart: lineStart,
			};
		}
	}

	// Recursively check children
	let foundResult: AmbiguityResult | undefined;
	ts.forEachChild(node, (child) => {
		if (!foundResult) {
			foundResult = findAmbiguousExpression(child, sourceFile, rootExpression);
		}
	});

	return foundResult;
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
	let pos = lineStart;

	while (pos < text.length && (text[pos] === " " || text[pos] === "\t")) {
		pos++;
	}

	return pos;
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
		unexpectedCall: {
			primary:
				"Avoid ambiguous line breaks before parentheses that could be interpreted as function calls.",
			secondary: [
				"When a line ends with an expression and the next line starts with parentheses, it may be interpreted as a function call instead of two separate statements.",
				"This can lead to unexpected behavior and runtime errors that are difficult to debug.",
			],
			suggestions: [
				"Add a semicolon after the first expression to make it clear they are separate statements.",
				"Alternatively, move the parentheses to the same line as the expression if a function call is intended.",
			],
		},
		unexpectedProperty: {
			primary:
				"Avoid ambiguous line breaks before brackets that could be interpreted as property access.",
			secondary: [
				"When a line ends with an expression and the next line starts with brackets, it may be interpreted as property access instead of two separate statements.",
				"This can lead to unexpected behavior and runtime errors that are difficult to debug.",
			],
			suggestions: [
				"Add a semicolon after the first expression to make it clear they are separate statements.",
				"Alternatively, move the brackets to the same line as the expression if property access is intended.",
			],
		},
		unexpectedTemplate: {
			primary:
				"Avoid ambiguous line breaks before template literals that could be interpreted as tagged templates.",
			secondary: [
				"When a line ends with an expression and the next line starts with a template literal, it may be interpreted as a tagged template instead of two separate statements.",
				"This can lead to unexpected behavior and runtime errors that are difficult to debug.",
			],
			suggestions: [
				"Add a semicolon after the first expression to make it clear they are separate statements.",
				"Alternatively, move the template literal to the same line as the expression if a tagged template is intended.",
			],
		},
	},
	setup(context) {
		function checkNode(node: ts.Node) {
			let expressionToCheck: ts.Expression | undefined;

			if (ts.isVariableDeclaration(node) && node.initializer) {
				expressionToCheck = node.initializer;
			} else if (ts.isExpressionStatement(node)) {
				expressionToCheck = node.expression;
			}

			if (!expressionToCheck) {
				return;
			}

			const result = findAmbiguousExpression(
				expressionToCheck,
				context.sourceFile,
				expressionToCheck,
			);

			if (!result) {
				return;
			}

			context.report({
				message: result.message,
				range: {
					begin: result.rangeStart,
					end: result.rangeEnd,
				},
			});
		}

		return {
			visitors: {
				ExpressionStatement: checkNode,
				VariableDeclaration: checkNode,
			},
		};
	},
});
