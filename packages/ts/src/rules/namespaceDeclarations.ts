import * as tsutils from "ts-api-utils";
import * as ts from "typescript";
import { z } from "zod";

import { getNodeRange } from "../getNodeRange.js";
import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		id: "namespaceDeclarations",
		preset: "logical",
	},
	messages: {
		preferModules: {
			primary:
				"Prefer using ECMAScript modules over legacy TypeScript namespaces.",
			secondary: [
				"Namespaces are a legacy feature of TypeScript that can lead to confusion and are not compatible with ECMAScript modules.",
			],
			suggestions: [
				"Modern codebases generally use `export` and `import` statements to define and use ECMAScript modules instead.",
			],
		},
	},
	options: {
		allowDeclarations: z.boolean().default(false),
		allowDefinitionFiles: z.boolean().default(false),
	},
	setup(context, { allowDeclarations, allowDefinitionFiles }) {
		if (allowDefinitionFiles && context.sourceFile.isDeclarationFile) {
			return;
		}

		return {
			ModuleDeclaration(node) {
				if (
					node.parent.kind !== ts.SyntaxKind.SourceFile ||
					node.name.kind !== ts.SyntaxKind.Identifier ||
					node.name.text === "global"
				) {
					return;
				}

				if (
					allowDeclarations &&
					tsutils.includesModifier(node.modifiers, ts.SyntaxKind.DeclareKeyword)
				) {
					return;
				}

				context.report({
					message: "preferModules",
					range: getNodeRange(node.getChildAt(0), context.sourceFile),
				});
			},
		};
	},
});
