import { runtimeBase } from "@flint.fyi/core";
import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";
import { getModifyingReferences } from "../utils/getModifyingReferences.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports reassigning exception parameters in catch clauses.",
		id: "exceptionAssignments",
		preset: "logical",
	},
	messages: {
		noExAssign: {
			primary:
				"Exception parameters in catch clauses should not be reassigned.",
			secondary: [
				"Reassigning an exception parameter can make debugging more difficult by obscuring the original error.",
				"The exception parameter contains important information about what went wrong, and reassigning it can make it harder to understand the root cause of an error.",
			],
			suggestions: [
				"Use a different variable name for the new value instead of reassigning the exception parameter.",
			],
		},
	},
	setup() {
		function collectBindingElements(name: ts.BindingName): ts.Identifier[] {
			const identifiers: ts.Identifier[] = [];

			if (ts.isIdentifier(name)) {
				identifiers.push(name);
			} else if (
				ts.isObjectBindingPattern(name) ||
				ts.isArrayBindingPattern(name)
			) {
				for (const element of name.elements) {
					if (ts.isBindingElement(element)) {
						identifiers.push(...collectBindingElements(element.name));
					}
				}
			}

			return identifiers;
		}

		return {
			...runtimeBase,
			visitors: {
				CatchClause: (node, context) => {
					if (!node.variableDeclaration?.name) {
						return;
					}

					const identifiers = collectBindingElements(
						node.variableDeclaration.name,
					);

					for (const identifier of identifiers) {
						const modifyingReferences = getModifyingReferences(
							identifier,
							context.sourceFile,
							context.typeChecker,
						);

						for (const reference of modifyingReferences) {
							context.report({
								message: "noExAssign",
								range: {
									begin: reference.getStart(context.sourceFile),
									end: reference.getEnd(),
								},
							});
						}
					}
				},
			},
		};
	},
});
