import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports variables declared with var that are referenced outside their defining block scope.",
		id: "variableBlockScopeUsage",
		preset: "untyped",
	},
	messages: {
		outOfScope: {
			primary:
				"Variable '{{ name }}' is declared with var but used outside its block scope.",
			secondary: [
				"Variables declared with var are function-scoped, not block-scoped, which can lead to unexpected behavior.",
				"When a var is declared in a block (like an if statement or for loop), it's actually hoisted to the function scope.",
				"References outside the declaring block can access variables that may not be initialized or may have unexpected values.",
			],
			suggestions: [
				"Use let or const instead of var to ensure block-level scoping.",
				"Move the variable declaration to a scope that encompasses all its usages.",
			],
		},
	},
	setup(context) {
		function getDeclaringBlock(node: ts.Node): ts.Node | undefined {
			let current = node.parent;
			while (!ts.isSourceFile(current)) {
				if (
					ts.isBlock(current) ||
					ts.isCaseClause(current) ||
					ts.isDefaultClause(current) ||
					ts.isForStatement(current) ||
					ts.isForInStatement(current) ||
					ts.isForOfStatement(current)
				) {
					return current;
				}
				// Stop at function boundaries - var at function scope is fine
				if (
					ts.isFunctionDeclaration(current) ||
					ts.isFunctionExpression(current) ||
					ts.isArrowFunction(current) ||
					ts.isMethodDeclaration(current)
				) {
					return undefined;
				}
				current = current.parent;
			}
			return undefined;
		}

		function isInScope(declaringBlock: ts.Node, reference: ts.Node): boolean {
			let current = reference;
			while (!ts.isSourceFile(current)) {
				if (current === declaringBlock) {
					return true;
				}
				// Don't cross function boundaries
				if (
					ts.isFunctionDeclaration(current) ||
					ts.isFunctionExpression(current) ||
					ts.isArrowFunction(current) ||
					ts.isMethodDeclaration(current)
				) {
					return false;
				}
				current = current.parent;
			}
			return false;
		}

		return {
			visitors: {
				VariableDeclarationList: (node) => {
					// Only check var declarations
					if (
						!(node.flags & ts.NodeFlags.Let) &&
						!(node.flags & ts.NodeFlags.Const)
					) {
						for (const declaration of node.declarations) {
							if (ts.isIdentifier(declaration.name)) {
								const declaringBlock = getDeclaringBlock(declaration.name);

								// If no block found, the variable is at function scope
								if (!declaringBlock) {
									continue;
								}

								const symbol = context.typeChecker.getSymbolAtLocation(
									declaration.name,
								);
								if (!symbol) {
									continue;
								}

								// Find all references to this variable
								const references: ts.Identifier[] = [];
								function findReferences(node: ts.Node): void {
									if (ts.isIdentifier(node)) {
										const nodeSymbol =
											context.typeChecker.getSymbolAtLocation(node);
										if (nodeSymbol === symbol && node !== declaration.name) {
											references.push(node);
										}
									}
									ts.forEachChild(node, findReferences);
								}

								// Search from the nearest function scope
								let searchRoot: ts.Node = declaration;
								while (!ts.isSourceFile(searchRoot)) {
									const parent = searchRoot.parent;
									if (
										ts.isFunctionDeclaration(parent) ||
										ts.isFunctionExpression(parent) ||
										ts.isArrowFunction(parent) ||
										ts.isMethodDeclaration(parent) ||
										ts.isSourceFile(parent)
									) {
										searchRoot = parent;
										break;
									}
									searchRoot = parent;
								}

								findReferences(searchRoot);

								// Report references that are out of scope
								for (const reference of references) {
									if (!isInScope(declaringBlock, reference)) {
										context.report({
											data: {
												name: declaration.name.text,
											},
											message: "outOfScope",
											range: {
												begin: reference.getStart(context.sourceFile),
												end: reference.getEnd(),
											},
										});
									}
								}
							}
						}
					}
				},
			},
		};
	},
});
