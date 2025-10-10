import * as tsutils from "ts-api-utils";
import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

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
			const symbol = typeChecker.getSymbolAtLocation(identifier);
			if (!symbol?.valueDeclaration) {
				return false;
			}

			const valueDeclaration = symbol.valueDeclaration;
			let hasAssignment = false;

			function visit(node: ts.Node): void {
				if (hasAssignment) {
					return;
				}

				if (ts.isIdentifier(node)) {
					const nodeSymbol = typeChecker.getSymbolAtLocation(node);
					if (
						nodeSymbol?.valueDeclaration &&
						nodeSymbol.valueDeclaration === valueDeclaration
					) {
						const parent = node.parent;

						// Assignment expressions (=, +=, -=, etc.)
						if (
							ts.isBinaryExpression(parent) &&
							tsutils.isAssignmentKind(parent.operatorToken.kind) &&
							parent.left === node
						) {
							hasAssignment = true;
							return;
						}
						// Unary expressions (++, --)
						if (
							(ts.isPostfixUnaryExpression(parent) ||
								ts.isPrefixUnaryExpression(parent)) &&
							parent.operand === node
						) {
							hasAssignment = true;
							return;
						}
					}
				}

				ts.forEachChild(node, visit);
			}

			visit(sourceFile);
			return hasAssignment;
		}

		return {
			visitors: {
				VariableDeclaration: (node) => {
					// Skip declarations with initializers
					if (node.initializer) {
						return;
					}

					// Only check simple identifier bindings
					if (!ts.isIdentifier(node.name)) {
						return;
					}

					// Skip const declarations - they must have initializers (syntax error otherwise)
					if (
						ts.isVariableDeclarationList(node.parent) &&
						(node.parent.flags & ts.NodeFlags.Const) === ts.NodeFlags.Const
					) {
						return;
					}

					// Check if the variable is ever assigned
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
