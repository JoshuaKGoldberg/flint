// eslint-disable perfectionist/sort-switch-case -- cases are ordered by importance, not alphabetically
import type { ReportMessageData, RuleContextForLang } from "@flint.fyi/core";

import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

const messages = {
	fnParam: {
		primary:
			"Public facing functions should have explicit types for all parameters.",
		secondary: ["{{ parameterName }} is declared here."],
		suggestions: [],
	},
	fnReturn: {
		primary: "Public facing functions should have an explicit return type.",
		secondary: [],
		suggestions: [],
	},
	fnReturnWithSuggestion: {
		primary: "Public facing functions should have an explicit return type.",
		secondary: [],
		suggestions: [
			"Add `{{ returnType }}` to the return type of this function.",
		],
	},
} satisfies Record<string, ReportMessageData>;

type Ctx = RuleContextForLang<typeof typescriptLanguage, keyof typeof messages>;

export default typescriptLanguage.createRule({
	about: {
		id: "explicitModuleBoundaryTypes",
		preset: "restrictive",
	},
	messages,
	setup(ctx) {
		const sourceFile = ctx.sourceFile;
		// ignore .d.ts and .js files
		if (sourceFile.isDeclarationFile || isJavaScriptFile(sourceFile)) {
			return;
		}
		const src = ctx.typeChecker.getSymbolAtLocation(sourceFile);
		const exports = src?.exports;
		if (!exports) {
			return;
		}
		checkExports(ctx, exports);
	},
});

const isJavaScriptFile = (sourceFile: ts.SourceFile): boolean =>
	/\.[cm]?jsx?$/.test(sourceFile.fileName);

function checkExports(ctx: Ctx, exports: ts.SymbolTable): void {
	for (const [, symbol] of exports) {
		const decls = symbol.getDeclarations();
		if (!decls) {
			continue;
		}

		for (const decl of decls) {
			switch (decl.kind) {
				// `export function foo() {}`
				case ts.SyntaxKind.FunctionDeclaration:
					checkFunction(ctx, decl as ts.FunctionDeclaration);
					break;

				/*
				look for namespace exports that need explicit types, e.g.

				export namespace Foo {
				  export function foo(a: number) {
								  ^^^ missing return type
					return a;
				  }
				}
				*/
				case ts.SyntaxKind.ModuleDeclaration: {
					const ns = decl as ts.ModuleDeclaration;
					const nsSymbol = ctx.typeChecker.getSymbolAtLocation(ns.name);
					if (!nsSymbol?.exports) {
						continue;
					}
					checkExports(ctx, nsSymbol.exports);
					break;
				}

				// `const arrow = () => {}
				// `const fn = function fn() {}`
				case ts.SyntaxKind.VariableDeclaration: {
					const varDecl = decl as ts.VariableDeclaration;
					if (varDecl.type || !varDecl.initializer) {
						continue;
					}
					switch (varDecl.initializer.kind) {
						case ts.SyntaxKind.ArrowFunction:
						case ts.SyntaxKind.FunctionExpression:
							checkFunction(
								ctx,
								varDecl.initializer as ts.ArrowFunction | ts.FunctionExpression,
								varDecl.name,
							);
							break;
						default:
							break;
					}
					break;
				}

				default:
					break;
			}
		}
	}
}

function checkFunction(
	{ report, sourceFile, typeChecker: checker }: Ctx,
	fn: ts.ArrowFunction | ts.FunctionDeclaration | ts.FunctionExpression,
	identifier?: ts.BindingName,
): void {
	const { name, parameters, type } = fn;

	// check for parameters without type annotations
	for (const param of parameters) {
		const { name, type } = param;
		const range = { begin: name.pos, end: name.end };
		if (type === undefined) {
			report({
				data: { parameterName: name.getText(sourceFile) },
				message: "fnParam",
				range,
			});
		}
	}

	// Check for declarations without return type annotations
	if (type) {
		return;
	}

	const range = getTSNodeRange(identifier ?? name ?? fn, sourceFile);
	const fnType = checker.getTypeAtLocation(fn);

	const signatures = fnType.getCallSignatures();
	const start = fn.parameters.end;
	const end = fn.body?.pos ?? start + 1;
	if (signatures.length !== 1) {
		report({ message: "fnReturn", range });
		return;
	}
	const returnType = checker.getReturnTypeOfSignature(signatures[0]);
	const text = checker.typeToString(returnType, sourceFile);
	report({
		data: { returnType: text },
		fix: {
			range: { begin: start, end },
			text,
		},
		message: "fnReturnWithSuggestion",
		range,
	});
}
