import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports variables explicitly initialized to undefined, which is unnecessary.",
		id: "undefinedInitialValues",
		preset: "stylistic",
	},
	messages: {
		noUndefinedInit: {
			primary: "Variables should not be explicitly initialized to undefined.",
			secondary: [
				"In JavaScript and TypeScript, variables are automatically initialized to undefined if no value is provided.",
				"Explicitly setting a variable to undefined is redundant and adds unnecessary code.",
			],
			suggestions: [
				"Remove the initializer and let the variable default to undefined.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				VariableStatement: (node) => {
					if (
						node.declarationList.flags & ts.NodeFlags.Const ||
						node.declarationList.flags === ts.NodeFlags.Const
					) {
						return;
					}

					for (const declaration of node.declarationList.declarations) {
						if (
							declaration.initializer &&
							declaration.initializer.kind === ts.SyntaxKind.Identifier &&
							(declaration.initializer as ts.Identifier).text === "undefined"
						) {
							const equalsToken = declaration
								.getChildren(context.sourceFile)
								.find((child) => child.kind === ts.SyntaxKind.EqualsToken);

							if (!equalsToken) {
								continue;
							}

							const range = {
								begin: equalsToken.getStart(context.sourceFile),
								end:
									declaration.initializer.getStart(context.sourceFile) +
									"undefined".length,
							};

							context.report({
								message: "noUndefinedInit",
								range,
								suggestions: [
									{
										id: "removeUndefinedInit",
										range,
										text: "",
									},
								],
							});
						}
					}
				},
			},
		};
	},
});
