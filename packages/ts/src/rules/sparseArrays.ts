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
		return {
			visitors: {
				ArrayLiteralExpression: (node) => {
					for (let i = 0; i < node.elements.length; i++) {
						const element = node.elements[i];
						if (ts.isOmittedExpression(element)) {
							// Find the comma that represents this hole
							// For a hole like [1, , 3], there are two commas:
							// - The first comma after the previous element
							// - The second comma representing the hole itself
							// We want to report on the second comma

							const searchStart =
								i === 0
									? node.getStart(context.sourceFile) + 1
									: node.elements[i - 1].getEnd();

							let firstCommaPos = -1;
							let holeCommaPos = -1;

							for (
								let j = searchStart;
								j < context.sourceFile.text.length;
								j++
							) {
								if (context.sourceFile.text[j] === ",") {
									if (firstCommaPos === -1) {
										firstCommaPos = j;
									} else {
										holeCommaPos = j;
										break;
									}
								}
							}

							// For holes at the beginning like [, 2], there's only one comma
							const commaToReport =
								holeCommaPos !== -1 ? holeCommaPos : firstCommaPos;

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
					}
				},
			},
		};
	},
});
