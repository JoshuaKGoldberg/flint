import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports array literals with holes (sparse arrays).",
		id: "sparseArrays",
		preset: "logical",
	},
	messages: {
		noSparseArray: {
			primary:
				"Avoid sparse arrays with holes. Use explicit `undefined` values instead.",
			secondary: [
				"Sparse arrays contain holes (empty slots) that behave differently from `undefined` values.",
				"Array methods treat holes inconsistently, which can lead to unexpected behavior and bugs.",
				"Using explicit `undefined` values makes the intent clear and ensures consistent behavior.",
			],
			suggestions: [
				"Replace holes with explicit `undefined` values.",
				"Remove unintended commas if the holes are accidental.",
			],
		},
	},
	setup(context) {
		function findCommaPositions(
			node: ts.ArrayLiteralExpression,
			startingIndex: number,
		) {
			const searchStart =
				startingIndex === 0
					? node.getStart(context.sourceFile) + 1
					: node.elements[startingIndex - 1].getEnd();

			let first = -1;
			let hole: number | undefined;

			for (let j = searchStart; j < context.sourceFile.text.length; j++) {
				if (context.sourceFile.text[j] === ",") {
					if (first === -1) {
						first = j;
					} else {
						hole = j;
						break;
					}
				}
			}

			return { first, hole };
		}

		return {
			visitors: {
				ArrayLiteralExpression: (node) => {
					for (let i = 0; i < node.elements.length; i++) {
						const element = node.elements[i];
						if (!ts.isOmittedExpression(element)) {
							continue;
						}

						const commaPositions = findCommaPositions(node, i);

						// Find the comma that represents this hole
						// For a hole like [1, , 3], there are two commas:
						// - The first comma after the previous element
						// - The second comma representing the hole itself
						// We want to report on the second comma
						// For holes at the beginning like [, 2], there's only one comma
						const commaToReport = commaPositions.hole ?? commaPositions.first;

						if (commaToReport !== -1) {
							const range = {
								begin: commaToReport,
								end: commaToReport + 1,
							};

							context.report({
								message: "noSparseArray",
								range,
							});
						}
					}
				},
			},
		};
	},
});
