import type {
	CharacterReportRange,
	ReportMessageData,
	RuleReport,
} from "@flint.fyi/core";
import type { RuleContext } from "@flint.fyi/core/src/types/context.js";

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
		// suggestions: ["Remove the redundant non-null assertion operator."],
	},
	fnReturnWithSuggestion: {
		primary: "Public facing functions should have an explicit return type.",
		secondary: [],
		suggestions: [
			"Add `{{ returnType }}` to the return type of this function.",
		],
	},
} satisfies Record<string, ReportMessageData>;

export default typescriptLanguage.createRule({
	about: {
		id: "explicitModuleBoundaryTypes",
		preset: "restrictive",
	},
	messages,
	setup(ctx) {
		const src = ctx.typeChecker.getSymbolAtLocation(ctx.sourceFile);
		const exports = src?.exports;
		if (!exports) {
			return;
		}
		for (const [_alias, symbol] of exports) {
			const decls = symbol.getDeclarations();
			if (!decls) {
				continue;
			}
			for (const decl of decls) {
				switch (decl.kind) {
					case ts.SyntaxKind.FunctionDeclaration:
						checkFunction(ctx, decl as ts.FunctionDeclaration);
						break;
					default:
						break;
				}
			}
		}
		return;
	},
});

function checkFunction(
	{
		report,
		sourceFile,
		typeChecker: checker,
	}: RuleContext<keyof typeof messages>,
	fn: ts.FunctionDeclaration,
): void {
	const { name, parameters, type } = fn;

	// check for parameters without type annotations
	for (const param of parameters) {
		const { name, type } = param;
		const range = { begin: name.pos + 1, end: name.end + 1 };
		if (type === undefined) {
			report({
				data: { parameterName: name.getText(sourceFile) },
				message: "fnParam",
				range,
			});
		}
	}

	// check for return type
	if (type) {
		return;
	}

	// const range: ts.ReadonlyTextRange = fn.name ?? fn;
	// const reportRange: CharacterReportRange = { begin: range.pos, end: range.end }
	// const range: CharacterReportRange = fn.name
	// ? { begin: fn.name.getStar}
	let range: CharacterReportRange;
	if (name) {
		range = getTSNodeRange(name, sourceFile);
		range.begin += 1;
		range.end += 1;
	} else {
		range = getTSNodeRange(fn, sourceFile);
	}
	const fnType = checker.getTypeAtLocation(fn);

	const signatures = fnType.getCallSignatures();
	const start = fn.parameters.end;
	const end = fn.body?.pos ?? start + 1;
	if (signatures.length !== 1) {
		report({ message: "fnReturn", range });
		return;
	}
	const returnType = checker.getReturnTypeOfSignature(signatures[0]);
	// turn type into string
	// note: this doesn't work
	// const printer = ts.createPrinter()
	// const text = printer.printNode(ts.EmitHint.Unspecified, returnType, sourceFile)
	// nor this
	// const text = returnType.getText(sourceFile);
	// so we'll do this:
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
