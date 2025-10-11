import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports empty block statements that should contain code.",
		id: "emptyBlocks",
		preset: "logical",
	},
	messages: {
		emptyBlock: {
			primary: "Empty block statements should be removed or contain code.",
			secondary: [
				"Empty blocks can indicate incomplete code or areas where logic was removed but the block structure was left behind.",
				"They can also reduce code readability by cluttering the codebase with unnecessary braces.",
			],
			suggestions: [
				"Add a comment explaining why the block is intentionally empty, or remove the empty block entirely.",
			],
		},
	},
	setup(context) {
		function hasComments(block: ts.Block): boolean {
			const sourceFile = context.sourceFile;
			const fullText = sourceFile.getFullText();

			// Get the text between the opening and closing braces
			const openBrace = block.getStart(sourceFile);
			const closeBrace = block.getEnd();
			const innerText = fullText.substring(openBrace + 1, closeBrace - 1);

			// Check if there are any non-whitespace characters (which would be comments)
			// since we already know there are no statements
			const trimmed = innerText.trim();
			return trimmed.length > 0;
		}

		function isEmptyBlock(block: ts.Block): boolean {
			return block.statements.length === 0 && !hasComments(block);
		}

		return {
			visitors: {
				Block: (node) => {
					// Don't report empty function/method/accessor blocks
					if (
						node.parent.kind === ts.SyntaxKind.CatchClause ||
						node.parent.kind === ts.SyntaxKind.FunctionDeclaration ||
						node.parent.kind === ts.SyntaxKind.FunctionExpression ||
						node.parent.kind === ts.SyntaxKind.ArrowFunction ||
						node.parent.kind === ts.SyntaxKind.MethodDeclaration ||
						node.parent.kind === ts.SyntaxKind.Constructor ||
						node.parent.kind === ts.SyntaxKind.GetAccessor ||
						node.parent.kind === ts.SyntaxKind.SetAccessor
					) {
						return;
					}

					if (isEmptyBlock(node)) {
						const range = {
							begin: node.getStart(context.sourceFile),
							end: node.getEnd(),
						};

						context.report({
							message: "emptyBlock",
							range,
						});
					}
				},
				CaseBlock: (node) => {
					if (node.clauses.length === 0) {
						const range = {
							begin: node.getStart(context.sourceFile),
							end: node.getEnd(),
						};

						context.report({
							message: "emptyBlock",
							range,
						});
					}
				},
			},
		};
	},
});
