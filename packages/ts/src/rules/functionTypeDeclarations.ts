import { SyntaxKind } from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";
import * as AST from "../types/ast.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Enforce using function types instead of interfaces with call signatures.",
		id: "functionTypeDeclarations",
		preset: "stylistic",
	},
	messages: {
		preferFunctionType: {
			body: "{{kind}}",
			primary:
				"{{kind}} only has a call signature. Use a function type instead.",
			secondary: [
				"Function type syntax `() => Type` is more concise than interface or type literal syntax for simple callable types.",
				"Using function types improves readability for types that only represent a callable.",
			],
			suggestions: [
				"Replace the interface with a type alias using function type syntax.",
				"Replace `{ (): T }` with `() => T`.",
			],
		},
	},
	setup(context) {
		function hasOneSupertype(node: AST.InterfaceDeclaration) {
			if (!node.heritageClauses?.length) {
				return false;
			}

			if (node.heritageClauses.length !== 1) {
				return true;
			}

			const clause = node.heritageClauses[0];
			if (clause.types.length !== 1) {
				return true;
			}

			const extendsExpr = clause.types[0].expression;
			return !(
				extendsExpr.kind === SyntaxKind.Identifier &&
				extendsExpr.text === "Function"
			);
		}

		function isCallSignatureOnly(members: AST.TypeElement[]) {
			if (members.length !== 1) {
				return false;
			}

			const member = members[0];
			return (
				member.kind === SyntaxKind.CallSignature && member.type !== undefined
			);
		}

		return {
			visitors: {
				InterfaceDeclaration: (node, { sourceFile }) => {
					if (hasOneSupertype(node)) {
						return;
					}

					if (!isCallSignatureOnly([...node.members])) {
						return;
					}

					context.report({
						data: { kind: "Interface" },
						message: "preferFunctionType",
						range: getTSNodeRange(node.members[0], sourceFile),
					});
				},
				TypeLiteral: (node, { sourceFile }) => {
					if (!isCallSignatureOnly([...node.members])) {
						return;
					}

					context.report({
						data: { kind: "Type literal" },
						message: "preferFunctionType",
						range: getTSNodeRange(node.members[0], sourceFile),
					});
				},
			},
		};
	},
});
