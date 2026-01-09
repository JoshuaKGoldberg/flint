import * as tsutils from "ts-api-utils";
import ts, { SyntaxKind } from "typescript";
import { z } from "zod";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import {
	type TypeScriptFileServices,
	typescriptLanguage,
} from "../language.ts";
import type * as AST from "../types/ast.ts";

type MemberNode =
	| AST.GetAccessorDeclaration
	| AST.MethodDeclaration
	| AST.PropertyDeclaration
	| AST.SetAccessorDeclaration;

interface Options {
	enforceForClassFields: boolean;
	exceptMethods: Set<string>;
	ignoreClassesThatImplementAnInterface: "all" | "public-fields" | false;
}

function getFunctionLikeInitializer(
	node: AST.PropertyDeclaration,
): AST.ArrowFunction | AST.FunctionExpression | undefined {
	if (!node.initializer) {
		return undefined;
	}

	if (
		ts.isArrowFunction(node.initializer) ||
		ts.isFunctionExpression(node.initializer)
	) {
		return node.initializer as AST.ArrowFunction | AST.FunctionExpression;
	}

	return undefined;
}

function getMethodName(node: MemberNode): string | undefined {
	if (ts.isComputedPropertyName(node.name)) {
		return undefined;
	}

	if (ts.isPrivateIdentifier(node.name)) {
		return node.name.text;
	}

	return node.name.getText();
}

function hasModifier(node: MemberNode, kind: SyntaxKind): boolean {
	return node.modifiers?.some((m) => m.kind === kind) ?? false;
}

function isClassImplementingInterface(node: MemberNode): boolean {
	const parent = node.parent;
	if (!ts.isClassDeclaration(parent) && !ts.isClassExpression(parent)) {
		return false;
	}

	return (parent.heritageClauses ?? []).some(
		(clause) => clause.token === SyntaxKind.ImplementsKeyword,
	);
}

function isPublicMember(node: MemberNode): boolean {
	if (ts.isPrivateIdentifier(node.name)) {
		return false;
	}

	if (!node.modifiers) {
		return true;
	}

	return !node.modifiers.some(
		(m) =>
			m.kind === SyntaxKind.PrivateKeyword ||
			m.kind === SyntaxKind.ProtectedKeyword,
	);
}

function shouldReport(node: MemberNode, options: Options): boolean {
	if (hasModifier(node, SyntaxKind.AbstractKeyword)) {
		return false;
	}

	if (hasModifier(node, SyntaxKind.OverrideKeyword)) {
		return false;
	}

	if (hasModifier(node, SyntaxKind.StaticKeyword)) {
		return false;
	}

	if (shouldSkipDueToImplements(node, options)) {
		return false;
	}

	const name = getMethodName(node);
	if (name !== undefined && options.exceptMethods.has(name)) {
		return false;
	}

	if (ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node)) {
		if (!node.body) {
			return false;
		}

		return !usesThis(node.body);
	}

	if (ts.isMethodDeclaration(node)) {
		if (!node.body) {
			return false;
		}

		return !usesThis(node.body);
	}

	if (ts.isPropertyDeclaration(node)) {
		if (!options.enforceForClassFields) {
			return false;
		}

		const initializer = getFunctionLikeInitializer(
			node as AST.PropertyDeclaration,
		);
		if (!initializer) {
			return false;
		}

		return !usesThis(initializer);
	}

	return false;
}

function shouldSkipDueToImplements(
	node: MemberNode,
	options: Options,
): boolean {
	if (!options.ignoreClassesThatImplementAnInterface) {
		return false;
	}

	if (!isClassImplementingInterface(node)) {
		return false;
	}

	if (options.ignoreClassesThatImplementAnInterface === "all") {
		return true;
	}

	return isPublicMember(node);
}

function usesThis(checkNode: ts.Node): boolean {
	if (
		checkNode.kind === SyntaxKind.SuperKeyword ||
		checkNode.kind === SyntaxKind.ThisKeyword
	) {
		return true;
	}

	if (
		tsutils.isFunctionScopeBoundary(checkNode) &&
		!ts.isArrowFunction(checkNode)
	) {
		return false;
	}

	return ts.forEachChild(checkNode, usesThis) ?? false;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports class methods that don't use `this` and could be static.",
		id: "classMethodsThis",
		preset: "stylistic",
	},
	messages: {
		accessorCouldBeStatic: {
			primary: "Accessor does not use `this` and could be made static.",
			secondary: [
				"Static accessors don't require an instance to be called and make it clear that the accessor doesn't depend on instance state.",
			],
			suggestions: ["Add the `static` keyword to this accessor."],
		},
		couldBeStatic: {
			primary: "Method does not use `this` and could be made static.",
			secondary: [
				"Static methods don't require an instance to be called and make it clear that the method doesn't depend on instance state.",
			],
			suggestions: ["Add the `static` keyword to this method."],
		},
		fieldCouldBeStatic: {
			primary:
				"Class field function does not use `this` and could be made static.",
			secondary: [
				"Static methods don't require an instance to be called and make it clear that the method doesn't depend on instance state.",
			],
			suggestions: ["Convert this to a static method or static property."],
		},
	},
	options: {
		enforceForClassFields: z
			.boolean()
			.default(true)
			.describe(
				"Whether to check class fields with function initializers (arrow functions or function expressions).",
			),
		exceptMethods: z
			.array(z.string())
			.default([])
			.describe("Method names to ignore. Use `#name` for private methods."),
		ignoreClassesThatImplementAnInterface: z
			.union([z.literal("all"), z.literal("public-fields"), z.literal(false)])
			.default(false)
			.describe(
				"Whether to ignore members in classes that implement an interface. Set to `'all'` to ignore all members, or `'public-fields'` to only ignore public members.",
			),
	},
	setup(context) {
		function makeOptions({
			options,
		}: TypeScriptFileServices & {
			options: {
				enforceForClassFields: boolean;
				exceptMethods: string[];
				ignoreClassesThatImplementAnInterface: "all" | "public-fields" | false;
			};
		}): Options {
			return {
				enforceForClassFields: options.enforceForClassFields,
				exceptMethods: new Set(options.exceptMethods),
				ignoreClassesThatImplementAnInterface:
					options.ignoreClassesThatImplementAnInterface,
			};
		}

		return {
			visitors: {
				GetAccessor: (node, services) => {
					if (shouldReport(node, makeOptions(services))) {
						context.report({
							message: "accessorCouldBeStatic",
							range: getTSNodeRange(node.name, services.sourceFile),
						});
					}
				},
				MethodDeclaration: (node, services) => {
					if (shouldReport(node, makeOptions(services))) {
						context.report({
							message: "couldBeStatic",
							range: getTSNodeRange(node.name, services.sourceFile),
						});
					}
				},
				PropertyDeclaration: (node, services) => {
					if (shouldReport(node, makeOptions(services))) {
						context.report({
							message: "fieldCouldBeStatic",
							range: getTSNodeRange(node.name, services.sourceFile),
						});
					}
				},
				SetAccessor: (node, services) => {
					if (shouldReport(node, makeOptions(services))) {
						context.report({
							message: "accessorCouldBeStatic",
							range: getTSNodeRange(node.name, services.sourceFile),
						});
					}
				},
			},
		};
	},
});
