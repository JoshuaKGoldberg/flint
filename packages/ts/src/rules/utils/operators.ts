import * as ts from "typescript";

export function isComparisonOperator(token: ts.BinaryOperatorToken) {
	switch (token.kind) {
		case ts.SyntaxKind.EqualsEqualsEqualsToken:
		case ts.SyntaxKind.EqualsEqualsToken:
		case ts.SyntaxKind.ExclamationEqualsEqualsToken:
		case ts.SyntaxKind.ExclamationEqualsToken:
		case ts.SyntaxKind.GreaterThanEqualsToken:
		case ts.SyntaxKind.GreaterThanToken:
		case ts.SyntaxKind.LessThanEqualsToken:
		case ts.SyntaxKind.LessThanToken:
			return true;
		default:
			return false;
	}
}

export function isEqualityOperator(token: ts.BinaryOperatorToken) {
	switch (token.kind) {
		case ts.SyntaxKind.EqualsEqualsEqualsToken:
		case ts.SyntaxKind.EqualsEqualsToken:
		case ts.SyntaxKind.ExclamationEqualsEqualsToken:
		case ts.SyntaxKind.ExclamationEqualsToken:
			return true;
		default:
			return false;
	}
}

export function isNegatedEqualityOperator(token: ts.BinaryOperatorToken) {
	switch (token.kind) {
		case ts.SyntaxKind.ExclamationEqualsEqualsToken:
		case ts.SyntaxKind.ExclamationEqualsToken:
			return true;
		default:
			return false;
	}
}
