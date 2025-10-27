import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
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
	setup(context) {
		function checkTestCase(testCase: ParsedTestCaseInvalid) {
			if (!testCase.code.startsWith("\n")) {
				context.report({
					fix: [createFixForCode(testCase), createFixForSnapshot(testCase)],
					message: "singleLineTest",
					range: getTSNodeRange(testCase.nodes.code, context.sourceFile),
				});
			}
		}

		function createFixForCode(testCase: ParsedTestCaseInvalid) {
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

		function createFixForSnapshot(testCase: ParsedTestCaseInvalid) {
			const begin = testCase.nodes.snapshot.getStart(context.sourceFile) + 1;

			return {
				range: {
					begin,
					end: begin,
				},
				text: "\n",
			};
		}

		return {
			visitors: {
				CallExpression(node) {
					const describedCases = getRuleTesterDescribedCases(node);
					if (!describedCases) {
						return;
					}

					describedCases.invalid.forEach(checkTestCase);
				},
			},
		};
	},
});
