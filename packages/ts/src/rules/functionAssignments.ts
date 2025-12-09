import { runtimeBase } from "@flint.fyi/core";

import { typescriptLanguage } from "../language.js";
import { getModifyingReferences } from "../utils/getModifyingReferences.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports reassigning variables declared with function declarations.",
		id: "functionAssignments",
		preset: "untyped",
	},
	messages: {
		noFunctionAssignment: {
			primary:
				"Variables declared with function declarations should not be reassigned.",
			secondary: [
				"Reassigning a function declaration can make code harder to understand and maintain.",
				"Function declarations are hoisted to the top of their scope, and reassigning them can lead to unexpected behavior.",
			],
			suggestions: [
				"Use a function expression or const variable instead if you need to reassign the function.",
			],
		},
	},
	setup() {
		return {
			...runtimeBase,
			visitors: {
				FunctionDeclaration: (node, context) => {
					if (!node.name) {
						return;
					}

					const modifyingReferences = getModifyingReferences(
						node.name,
						context.sourceFile,
						context.typeChecker,
					);

					for (const reference of modifyingReferences) {
						context.report({
							message: "noFunctionAssignment",
							range: {
								begin: reference.getStart(context.sourceFile),
								end: reference.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
