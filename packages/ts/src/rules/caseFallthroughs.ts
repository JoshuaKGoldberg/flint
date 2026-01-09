import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

const fallthroughCommentPattern = /falls?\s*through/i;

function endsWithTerminatingStatement(statements: ts.NodeArray<ts.Statement>) {
	if (statements.length === 0) {
		return false;
	}

	const lastStatement = statements[statements.length - 1];
	return isTerminatingStatement(lastStatement);
}

function hasFallthroughComment(
	clause: ts.CaseClause | ts.DefaultClause,
	nextClause: ts.CaseClause | ts.DefaultClause,
	sourceFile: ts.SourceFile,
): boolean {
	const sourceText = sourceFile.getFullText();
	const commentRanges = ts.getLeadingCommentRanges(
		sourceText,
		nextClause.getFullStart(),
	);

	if (commentRanges) {
		for (const range of commentRanges) {
			const comment = sourceText.slice(range.pos, range.end);
			if (fallthroughCommentPattern.test(comment)) {
				return true;
			}
		}
	}

	const trailingRanges = ts.getTrailingCommentRanges(
		sourceText,
		clause.getEnd(),
	);
	if (trailingRanges) {
		for (const range of trailingRanges) {
			const comment = sourceText.slice(range.pos, range.end);
			if (fallthroughCommentPattern.test(comment)) {
				return true;
			}
		}
	}

	return false;
}

function isTerminatingStatement(node: ts.Statement): boolean {
	switch (node.kind) {
		case ts.SyntaxKind.Block:
			return endsWithTerminatingStatement((node as ts.Block).statements);
		case ts.SyntaxKind.BreakStatement:
		case ts.SyntaxKind.ContinueStatement:
		case ts.SyntaxKind.ReturnStatement:
		case ts.SyntaxKind.ThrowStatement:
			return true;
		case ts.SyntaxKind.IfStatement: {
			const ifStmt = node as ts.IfStatement;
			if (!ifStmt.elseStatement) {
				return false;
			}

			return (
				isTerminatingStatement(ifStmt.thenStatement) &&
				isTerminatingStatement(ifStmt.elseStatement)
			);
		}

		case ts.SyntaxKind.SwitchStatement: {
			const switchStmt = node as ts.SwitchStatement;
			const clauses = switchStmt.caseBlock.clauses;
			const hasDefault = clauses.some(ts.isDefaultClause);
			if (!hasDefault) {
				return false;
			}

			return clauses.every(
				(clause) =>
					clause.statements.length === 0 ||
					endsWithTerminatingStatement(clause.statements),
			);
		}

		case ts.SyntaxKind.TryStatement: {
			const tryStmt = node as ts.TryStatement;
			if (tryStmt.finallyBlock) {
				return endsWithTerminatingStatement(tryStmt.finallyBlock.statements);
			}

			if (!tryStmt.catchClause) {
				return endsWithTerminatingStatement(tryStmt.tryBlock.statements);
			}

			return (
				endsWithTerminatingStatement(tryStmt.tryBlock.statements) &&
				endsWithTerminatingStatement(tryStmt.catchClause.block.statements)
			);
		}

		default:
			return false;
	}
}

export default typescriptLanguage.createRule({
	about: {
		description: "Reports switch case clauses that fall through unexpectedly.",
		id: "caseFallthroughs",
		preset: "logical",
	},
	messages: {
		unexpectedFallthrough: {
			primary:
				"This case falls through to the next case without a break, return, or throw statement.",
			secondary: [
				"Fallthrough in switch statements is often unintentional and can lead to bugs.",
				"If fallthrough is intentional, add a comment containing 'falls through' to indicate this.",
			],
			suggestions: [
				"Add a `break` statement at the end of this case.",
				"Add a `return` or `throw` statement if appropriate.",
				"If fallthrough is intentional, add a `// falls through` comment.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				SwitchStatement: (node, { sourceFile }) => {
					const clauses = node.caseBlock.clauses;

					for (let i = 0; i < clauses.length - 1; i++) {
						const clause = clauses[i];
						const nextClause = clauses[i + 1];

						if (clause.statements.length === 0) {
							continue;
						}

						if (endsWithTerminatingStatement(clause.statements)) {
							continue;
						}

						if (hasFallthroughComment(clause, nextClause, sourceFile)) {
							continue;
						}

						const caseKeyword = ts.isCaseClause(clause) ? "case" : "default";
						context.report({
							message: "unexpectedFallthrough",
							range: {
								begin: clause.getStart(sourceFile),
								end: clause.getStart(sourceFile) + caseKeyword.length,
							},
						});
					}
				},
			},
		};
	},
});
