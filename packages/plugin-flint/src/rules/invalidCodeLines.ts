import type { RuleContext } from "@flint.fyi/core";

import { runtimeBase } from "@flint.fyi/core";
import {
	getTSNodeRange,
	typescriptLanguage,
	type TypeScriptServices,
} from "@flint.fyi/ts";
import * as ts from "typescript";

import type { ParsedTestCaseInvalid } from "../types.js";

import { getRuleTesterDescribedCases } from "../getRuleTesterDescribedCases.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports cases for invalid code that isn't formatted across lines.",
		id: "invalidCodeLines",
		preset: "logical",
	},
	messages: {
		singleLineTest: {
			primary:
				"This code block should be formatted across multiple lines for more readable reports.",
			secondary: [
				"When writing `invalid` case code blocks, it's better to start code on a new line in a template literal string.",
				"Doing so allows the case's `snapshot` to visualize the `~` characters visually underneath reported ranges.",
			],
			suggestions: [
				"Delete this redundant test case.",
				"Change a property to make the test case unique.",
			],
		},
	},
	setup() {
		return {
			...runtimeBase,
			visitors: {
				CallExpression(node, context) {
					const describedCases = getRuleTesterDescribedCases(node);
					if (!describedCases) {
						return;
					}

					for (const testCase of describedCases.invalid) {
						checkTestCase(testCase, context);
					}
				},
			},
		};
	},
});

type Context = RuleContext<"singleLineTest"> & TypeScriptServices;

function checkTestCase(testCase: ParsedTestCaseInvalid, context: Context) {
	if (!testCase.code.startsWith("\n")) {
		context.report({
			fix: [
				createFixForCode(testCase, context),
				createFixForSnapshot(testCase, context),
			],
			message: "singleLineTest",
			range: getTSNodeRange(testCase.nodes.code, context.sourceFile),
		});
	}
}

function createFixForCode(testCase: ParsedTestCaseInvalid, context: Context) {
	if (ts.isStringLiteral(testCase.nodes.code)) {
		return {
			range: getTSNodeRange(testCase.nodes.code, context.sourceFile),
			text: `\`\n${testCase.code}\n\``,
		};
	}

	const begin = testCase.nodes.code.getStart(context.sourceFile) + 1;

	return {
		range: {
			begin,
			end: begin,
		},
		text: "\n",
	};
}

function createFixForSnapshot(
	testCase: ParsedTestCaseInvalid,
	context: Context,
) {
	const begin = testCase.nodes.snapshot.getStart(context.sourceFile) + 1;

	return {
		range: {
			begin,
			end: begin,
		},
		text: "\n",
	};
}
