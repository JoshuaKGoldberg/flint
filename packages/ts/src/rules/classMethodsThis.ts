import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

function containsThisExpression(node: ts.Node): boolean {
	let found = false;

	function visit(child: ts.Node): boolean | undefined {
		if (child.kind === ts.SyntaxKind.ThisKeyword) {
			found = true;
			return true;
		}

		if (
			ts.isFunctionDeclaration(child) ||
			ts.isFunctionExpression(child) ||
			ts.isClassDeclaration(child) ||
			ts.isClassExpression(child)
		) {
			return undefined;
		}

		return ts.forEachChild(child, visit);
	}

	ts.forEachChild(node, visit);
	return found;
}

function hasOverrideModifier(member: ts.MethodDeclaration): boolean {
	return (
		member.modifiers?.some(
			(modifier) => modifier.kind === ts.SyntaxKind.OverrideKeyword,
		) ?? false
	);
}

function isStaticMethod(member: ts.MethodDeclaration): boolean {
	return (
		member.modifiers?.some(
			(modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword,
		) ?? false
	);
}

export default typescriptLanguage.createRule({
	about: {
		description: "Enforce that class methods utilize `this`.",
		id: "classMethodsThis",
		preset: "stylistic",
	},
	messages: {
		methodWithoutThis: {
			primary:
				"This method does not use `this` and could be a static method or a standalone function.",
			secondary: [
				"Class methods that don't use `this` can usually be converted to static methods.",
				"Static methods are called on the class itself rather than on instances.",
			],
			suggestions: [
				"Add the `static` keyword to make this a static method.",
				"Extract this method to a standalone function outside the class.",
			],
		},
	},
	setup(context) {
		function visitClass(
			node: ts.ClassDeclaration | ts.ClassExpression,
			sourceFile: ts.SourceFile,
		) {
			for (const member of node.members) {
				if (!ts.isMethodDeclaration(member)) {
					continue;
				}

				if (isStaticMethod(member)) {
					continue;
				}

				if (!member.body) {
					continue;
				}

				if (hasOverrideModifier(member)) {
					continue;
				}

				if (containsThisExpression(member.body)) {
					continue;
				}

				context.report({
					message: "methodWithoutThis",
					range: {
						begin: member.getStart(sourceFile),
						end: member.getEnd(),
					},
				});
			}
		}

		return {
			visitors: {
				ClassDeclaration: (node, { sourceFile }) => {
					visitClass(node, sourceFile);
				},
				ClassExpression: (node, { sourceFile }) => {
					visitClass(node, sourceFile);
				},
			},
		};
	},
});
