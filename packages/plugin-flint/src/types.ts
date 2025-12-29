import type { InvalidTestCase, TestCase } from "@flint.fyi/rule-tester";
import * as ts from "typescript";

export interface ParsedTestCase extends TestCase {
	nodes: ParsedTestCaseNodes;
}

export interface ParsedTestCaseInvalid extends InvalidTestCase {
	nodes: ParsedTestCaseNodesInvalid;
}

export interface ParsedTestCaseNodes {
	case: ts.Node;
	code: ts.StringLiteralLike;
	fileName?: ts.StringLiteralLike;
	options?: ts.ObjectLiteralExpression;
}

export interface ParsedTestCaseNodesInvalid extends ParsedTestCaseNodes {
	snapshot: ts.Node;
}
