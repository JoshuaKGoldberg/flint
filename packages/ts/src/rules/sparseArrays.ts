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
				"Sparse arrays with \"holes\" (empty slots) are misleading and behave differently from `undefined` values.",
			secondary: [
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
				OmittedExpression: (node) => {
					const parent = node.parent;
					if (!ts.isArrayLiteralExpression(parent)) {
						return;
					}

					const syntaxList = parent
						.getChildren(context.sourceFile)
						.find((child) => child.kind === ts.SyntaxKind.SyntaxList);

					if (!syntaxList) {
						return;
					}

					const children = syntaxList.getChildren(context.sourceFile);
					const omittedIndex = children.indexOf(node);

					for (let i = omittedIndex + 1; i < children.length; i++) {
						if (children[i].kind === ts.SyntaxKind.CommaToken) {
							context.report({
								message: "noSparseArray",
								range: {
									begin: children[i].getStart(context.sourceFile),
									end: children[i].getEnd(),
								},
							});
							break;
						}
					}
				},
			},
		};
	},
});
