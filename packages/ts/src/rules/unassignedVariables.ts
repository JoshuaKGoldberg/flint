import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";
import { getModifyingReferences } from "../utils/getModifyingReferences.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports variables that are declared but never assigned a value.",
		id: "unassignedVariables",
		preset: "untyped",
	},
	messages: {
		noUnassigned: {
			primary: "Variable '{{ name }}' is declared but never assigned a value.",
			secondary: [
				"Declaring a variable without ever assigning it a value means it will always be `undefined`.",
				"This is often a mistake, such as forgetting to initialize the variable or assign to it later.",
			],
			suggestions: [
				"Assign a value to the variable, either at declaration or before it is used.",
				"If the variable is meant to be `undefined`, consider making that explicit for clarity.",
			],
		},
	},
	setup(context) {
		function hasAssignments(
			identifier: ts.Identifier,
			sourceFile: ts.SourceFile,
			typeChecker: ts.TypeChecker,
		): boolean {
			// TODO (#400): Switch to scope analysis
			return !!getModifyingReferences(identifier, sourceFile, typeChecker)
				.length;
		}

		return {
			visitors: {
				VariableDeclaration: (node) => {
					if (node.initializer || !ts.isIdentifier(node.name)) {
						return;
					}

					if (
						ts.isVariableDeclarationList(node.parent) &&
						!!(node.parent.flags & ts.NodeFlags.Const)
					) {
						return;
					}

					if (
						!hasAssignments(node.name, context.sourceFile, context.typeChecker)
					) {
						context.report({
							data: {
								name: node.name.text,
							},
							message: "noUnassigned",
							range: {
								begin: node.name.getStart(context.sourceFile),
								end: node.name.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
