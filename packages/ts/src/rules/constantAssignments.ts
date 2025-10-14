import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";
import { getModifyingReferences } from "../utils/getModifyingReferences.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports attempting to reassign variables declared with const.",
		id: "constantAssignments",
		preset: "untyped",
	},
	messages: {
		noConstAssign: {
			primary:
				"Variables declared with const cannot be reassigned; use let or var instead if reassignment is needed.",
			secondary: [
				"The const keyword creates a read-only reference to a value, preventing reassignment.",
				"While properties of const objects and elements of const arrays can be mutated, the binding itself cannot be reassigned.",
			],
			suggestions: [
				"Use let instead of const if you need to reassign the variable.",
			],
		},
	},
	setup(context) {
		function collectBindingElements(name: ts.BindingName): ts.Identifier[] {
			if (ts.isIdentifier(name)) {
				return [name];
			}

			const identifiers: ts.Identifier[] = [];

			for (const element of name.elements) {
				if (ts.isBindingElement(element)) {
					identifiers.push(...collectBindingElements(element.name));
				}
			}

			return identifiers;
		}

		return {
			visitors: {
				VariableDeclarationList: (node) => {
					if (
						!(node.flags & ts.NodeFlags.Const) ||
						node.declarations.length === 0
					) {
						return;
					}

					for (const declaration of node.declarations) {
						const identifiers = collectBindingElements(declaration.name);

						for (const identifier of identifiers) {
							const modifyingReferences = getModifyingReferences(
								identifier,
								context.sourceFile,
								context.typeChecker,
							);

							for (const reference of modifyingReferences) {
								context.report({
									message: "noConstAssign",
									range: {
										begin: reference.getStart(context.sourceFile),
										end: reference.getEnd(),
									},
								});
							}
						}
					}
				},
			},
		};
	},
});
