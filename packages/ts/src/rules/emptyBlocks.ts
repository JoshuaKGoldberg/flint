import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

const allowedParents = new Set([
	ts.SyntaxKind.ArrowFunction,
	ts.SyntaxKind.CatchClause,
	ts.SyntaxKind.Constructor,
	ts.SyntaxKind.FunctionDeclaration,
	ts.SyntaxKind.FunctionExpression,
	ts.SyntaxKind.GetAccessor,
	ts.SyntaxKind.MethodDeclaration,
	ts.SyntaxKind.SetAccessor,
]);

export default typescriptLanguage.createRule({
	about: {
		description: "Reports empty block statements that should contain code.",
		id: "emptyBlocks",
		preset: "stylistic",
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
		function hasComments(block: ts.Block, sourceFile: ts.SourceFile): boolean {
			const fullText = sourceFile.getFullText();

			const openBrace = block.getStart(sourceFile);
			const closeBrace = block.getEnd();
			const innerText = fullText.substring(openBrace + 1, closeBrace - 1);

			// Check if there are any non-whitespace characters (which would be comments)
			// since we already know there are no statements
			return /\S+/.test(innerText.trim());
		}

		function isEmptyBlock(block: ts.Block, sourceFile: ts.SourceFile): boolean {
			return block.statements.length === 0 && !hasComments(block, sourceFile);
		}

		return {
			visitors: {
				Block: (node, { sourceFile }) => {
					if (
						!allowedParents.has(node.parent.kind) &&
						isEmptyBlock(node, sourceFile)
					) {
						context.report({
							message: "emptyBlock",
							range: getTSNodeRange(node, sourceFile),
						});
					}
				},
				CaseBlock: (node, { sourceFile }) => {
					if (node.clauses.length === 0) {
						context.report({
							message: "emptyBlock",
							range: getTSNodeRange(node, sourceFile),
						});
					}
				},
			},
		};
	},
});
