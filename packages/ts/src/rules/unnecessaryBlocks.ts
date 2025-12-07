import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports standalone block statements that don't create a meaningful scope.",
		id: "unnecessaryBlocks",
		preset: "stylistic",
	},
	messages: {
		unnecessaryBlock: {
			primary:
				"This standalone block statement is unnecessary and doesn't change any variable scopes.",
			secondary: [
				"Standalone block statements that aren't part of control flow (if/else, loops, switch) or don't create a meaningful lexical scope can be confusing and should be avoided.",
				"In modern JavaScript and TypeScript, blocks primarily serve to create lexical scope for `let` and `const` variables, but this is often better achieved through other means.",
			],
			suggestions: [
				"Remove the block statement and move its contents to the parent scope.",
				"If you need lexical scoping, consider using an IIFE (Immediately Invoked Function Expression) or extracting to a separate function.",
			],
		},
	},
	setup() {
		function isValidBlock(node: ts.Block): boolean {
			const parent = node.parent;

			// Valid blocks: function bodies, arrow functions, class/interface bodies, etc.
			if (
				ts.isFunctionDeclaration(parent) ||
				ts.isFunctionExpression(parent) ||
				ts.isArrowFunction(parent) ||
				ts.isMethodDeclaration(parent) ||
				ts.isConstructorDeclaration(parent) ||
				ts.isGetAccessorDeclaration(parent) ||
				ts.isSetAccessorDeclaration(parent) ||
				ts.isModuleBlock(parent)
			) {
				return true;
			}

			// Valid blocks: control flow statements
			if (
				ts.isIfStatement(parent) ||
				ts.isForStatement(parent) ||
				ts.isForInStatement(parent) ||
				ts.isForOfStatement(parent) ||
				ts.isWhileStatement(parent) ||
				ts.isDoStatement(parent) ||
				ts.isWithStatement(parent) ||
				ts.isTryStatement(parent) ||
				ts.isCatchClause(parent)
			) {
				return true;
			}

			// Valid block: switch case/default clause with block
			// In ES6+, blocks in switch cases create scope for let/const
			if (ts.isCaseClause(parent) || ts.isDefaultClause(parent)) {
				return true;
			}

			// Valid block: labeled statement
			if (ts.isLabeledStatement(parent)) {
				return true;
			}

			return false;
		}

		return {
			visitors: {
				Block: (node, context) => {
					if (!isValidBlock(node)) {
						context.report({
							message: "unnecessaryBlock",
							range: {
								begin: node.getStart(context.sourceFile),
								end: node.getStart(context.sourceFile) + 1,
							},
						});
					}
				},
			},
		};
	},
});
