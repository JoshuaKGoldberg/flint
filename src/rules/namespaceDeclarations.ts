import * as tsutils from "ts-api-utils";
import * as ts from "typescript";
import { z } from "zod";

import { createRule } from "../createRule.js";

export default createRule({
	about: {
		id: "namespaceDeclarations",
		preset: "logical",
	},
	messages: {
		preferModules:
			"Prefer using ECMAScript modules over legacy TypeScript namespaces.",
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
					range: node.getChildAt(0),
				});
			},
		};
	},
});
