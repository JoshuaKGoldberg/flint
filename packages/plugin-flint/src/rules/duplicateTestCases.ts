import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";

import {
	getRuleTesterDescribedCases,
	ParsedTestCase,
} from "./getRuleTesterDescribedCases.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallows test cases that are identical to previous test cases.",
		id: "duplicateTestCases",
		preset: "logical",
	},
	messages: {
		duplicateTest: {
			primary: "This test code already appeared in a previous test.",
			secondary: [
				"When writing tests for lint rules, it's possible to accidentally create deeply identical test cases.",
				"Doing so provides no added benefit for testing and is unnecessary.",
			],
			suggestions: [
				"Delete this redundant test case.",
				"Change a property to make the test case unique.",
			],
		},
	},
	setup(context) {
		function checkTestCases(testCases: ParsedTestCase[]) {
			const seen = new Set<string>();

			for (const testCase of testCases) {
				const key = JSON.stringify({
					code: testCase.code,
					fileName: testCase.fileName,
					options: testCase.options,
				});

				if (seen.has(key)) {
					context.report({
						message: "duplicateTest",
						range: getTSNodeRange(testCase.node, context.sourceFile),
					});
				} else {
					seen.add(key);
				}
			}
		}

		return {
			visitors: {
				CallExpression(node) {
					const describedCases = getRuleTesterDescribedCases(node);
					if (!describedCases) {
						return;
					}

					checkTestCases(describedCases.invalid);
					checkTestCases(describedCases.valid);
				},
			},
		};
	},
});
