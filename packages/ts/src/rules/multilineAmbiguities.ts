import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

function getFirstNonWhitespaceOnLine(
	lineNumber: number,
	sourceFile: ts.SourceFile,
): number {
	const lineStart = sourceFile.getPositionOfLineAndCharacter(lineNumber, 0);
	const text = sourceFile.getText();
	let start = lineStart;

	while (start < text.length && /\s/.test(text[start])) {
		start++;
	}

	return start;
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
		return {
			visitors: {
				CallExpression: (node, { sourceFile }) => {
					// Skip if no arguments or optional chaining
					if (node.arguments.length === 0 || node.questionDotToken) {
						return;
					}

					const text = sourceFile.getText();
					const calleeText = node.expression.getText(sourceFile);
					const calleeStart =
						node.expression.pos >= 0
							? node.expression.pos
							: node.expression.getStart(sourceFile);
					const calleeEnd = calleeStart + calleeText.length;

					// Find the opening paren
					let openParenPos = calleeEnd;
					while (openParenPos < node.getEnd() && text[openParenPos] !== "(") {
						openParenPos++;
					}

					if (openParenPos >= node.getEnd()) {
						return; // No opening paren found (shouldn't happen)
					}

					// Check the line of the last character of the callee (not the position after it)
					const calleeLastCharPos = calleeEnd > 0 ? calleeEnd - 1 : 0;
					const { line: calleeEndLine } =
						sourceFile.getLineAndCharacterOfPosition(calleeLastCharPos);
					const { line: openParenLine } =
						sourceFile.getLineAndCharacterOfPosition(openParenPos);

					if (calleeEndLine < openParenLine) {
						context.report({
							data: {
								after: "parentheses",
								interpretation: "function call",
							},
							message: "ambiguity",
							range: {
								begin: getFirstNonWhitespaceOnLine(openParenLine, sourceFile),
								end: node.getEnd(),
							},
						});
					}
				},
				ElementAccessExpression: (node, { sourceFile }) => {
					// Skip optional chaining
					if (node.questionDotToken) {
						return;
					}

					const text = sourceFile.getText();
					const objectText = node.expression.getText(sourceFile);
					const objectStart =
						node.expression.pos >= 0
							? node.expression.pos
							: node.expression.getStart(sourceFile);
					const objectEnd = objectStart + objectText.length;

					// Find the opening bracket
					let openBracketPos = objectEnd;
					while (
						openBracketPos < node.getEnd() &&
						text[openBracketPos] !== "["
					) {
						openBracketPos++;
					}

					if (openBracketPos >= node.getEnd()) {
						return; // No opening bracket found (shouldn't happen)
					}

					// Check the line of the last character of the object (not the position after it)
					const objectLastCharPos = objectEnd > 0 ? objectEnd - 1 : 0;
					const { line: objectEndLine } =
						sourceFile.getLineAndCharacterOfPosition(objectLastCharPos);
					const { line: openBracketLine } =
						sourceFile.getLineAndCharacterOfPosition(openBracketPos);

					if (objectEndLine < openBracketLine) {
						context.report({
							data: {
								after: "brackets",
								interpretation: "property access",
							},
							message: "ambiguity",
							range: {
								begin: getFirstNonWhitespaceOnLine(openBracketLine, sourceFile),
								end: node.getEnd(),
							},
						});
					}
				},
				TaggedTemplateExpression: (node, { sourceFile }) => {
					const text = sourceFile.getText();
					const tagText = node.tag.getText(sourceFile);
					const tagStart =
						node.tag.pos >= 0 ? node.tag.pos : node.tag.getStart(sourceFile);
					const tagEnd = tagStart + tagText.length;
					const templateStart = node.template.getStart(sourceFile);

					// Check the line of the last character of the tag (not the position after it)
					const tagLastCharPos = tagEnd > 0 ? tagEnd - 1 : 0;
					const { line: tagEndLine } =
						sourceFile.getLineAndCharacterOfPosition(tagLastCharPos);
					const { line: templateStartLine } =
						sourceFile.getLineAndCharacterOfPosition(templateStart);

					if (tagEndLine < templateStartLine) {
						context.report({
							data: {
								after: "a template literal",
								interpretation: "tagged template",
							},
							message: "ambiguity",
							range: {
								begin: getFirstNonWhitespaceOnLine(
									templateStartLine,
									sourceFile,
								),
								end: node.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
