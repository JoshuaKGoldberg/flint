import * as ts from "typescript";

export function isAssignmentOperator(kind: ts.SyntaxKind): boolean {
	return (
		kind === ts.SyntaxKind.EqualsToken ||
		kind === ts.SyntaxKind.PlusEqualsToken ||
		kind === ts.SyntaxKind.MinusEqualsToken ||
		kind === ts.SyntaxKind.AsteriskEqualsToken ||
		kind === ts.SyntaxKind.AsteriskAsteriskEqualsToken ||
		kind === ts.SyntaxKind.SlashEqualsToken ||
		kind === ts.SyntaxKind.PercentEqualsToken ||
		kind === ts.SyntaxKind.LessThanLessThanEqualsToken ||
		kind === ts.SyntaxKind.GreaterThanGreaterThanEqualsToken ||
		kind === ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken ||
		kind === ts.SyntaxKind.AmpersandEqualsToken ||
		kind === ts.SyntaxKind.BarEqualsToken ||
		kind === ts.SyntaxKind.CaretEqualsToken ||
		kind === ts.SyntaxKind.BarBarEqualsToken ||
		kind === ts.SyntaxKind.AmpersandAmpersandEqualsToken ||
		kind === ts.SyntaxKind.QuestionQuestionEqualsToken
	);
}
