import ts, { SyntaxKind } from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";
import * as AST from "../types/ast.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports duplicate class member names that will be overwritten.",
		id: "classMemberDuplicates",
		preset: "untyped",
	},
	messages: {
		duplicateMember: {
			data: {
				memberName: "string",
			},
			primary:
				"Duplicate class member name '{{ memberName }}' will be overwritten.",
			secondary: [
				"Duplicate class member names cause the first definition to be silently overwritten by the second.",
				"This is almost always a mistake and can lead to hard-to-debug issues.",
			],
			suggestions: [
				"Rename one of the duplicate members to have a unique name.",
				"Remove the duplicate member if it was added by mistake.",
			],
		},
	},
	setup(context) {
		function checkClassMembers(
			node: AST.ClassDeclaration | AST.ClassExpression,
			sourceFile: ts.SourceFile,
		) {
			const seenMembers = {
				instance: {
					getters: new Map<string, ts.Node>(),
					setters: new Map<string, ts.Node>(),
					values: new Map<string, ts.Node>(),
				},
				static: {
					getters: new Map<string, ts.Node>(),
					setters: new Map<string, ts.Node>(),
					values: new Map<string, ts.Node>(),
				},
			};

			for (const member of node.members) {
				const memberInfo = getMemberInfo(member);
				if (!memberInfo) {
					continue;
				}

				const namespace = memberInfo.isStatic
					? seenMembers.static
					: seenMembers.instance;
				const existingNode = namespace[memberInfo.group].get(memberInfo.name);

				if (existingNode) {
					context.report({
						data: { memberName: memberInfo.name },
						message: "duplicateMember",
						range: getTSNodeRange(memberInfo.node, sourceFile),
					});
				} else {
					namespace[memberInfo.group].set(memberInfo.name, member);
				}
			}
		}

		return {
			visitors: {
				ClassDeclaration(node, { sourceFile }) {
					checkClassMembers(node, sourceFile);
				},
				ClassExpression(node, { sourceFile }) {
					checkClassMembers(node, sourceFile);
				},
			},
		};
	},
});

function getMemberInfo(member: AST.ClassElement) {
	if (
		member.kind === SyntaxKind.MethodDeclaration ||
		member.kind === SyntaxKind.PropertyDeclaration ||
		member.kind === SyntaxKind.GetAccessor ||
		member.kind === SyntaxKind.SetAccessor
	) {
		const name = getNameText(member.name);
		if (!name) {
			return undefined;
		}

		const isStatic =
			member.modifiers?.some((mod) => mod.kind === SyntaxKind.StaticKeyword) ??
			false;

		const group =
			member.kind === SyntaxKind.GetAccessor
				? "getters"
				: member.kind === SyntaxKind.SetAccessor
					? "setters"
					: "values";

		return { group, isStatic, name, node: member.name } as const;
	}

	return undefined;
}

function getNameText(name: AST.PropertyName) {
	if (
		name.kind === SyntaxKind.Identifier ||
		name.kind === SyntaxKind.NumericLiteral ||
		name.kind === SyntaxKind.BigIntLiteral ||
		name.kind === SyntaxKind.StringLiteral ||
		name.kind === SyntaxKind.NoSubstitutionTemplateLiteral
	) {
		return name.text;
	}

	if (name.kind === SyntaxKind.PrivateIdentifier) {
		return name.text;
	}

	return undefined;
}
