import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

type MemberKind =
	| "accessor"
	| "method-implementation"
	| "method-signature"
	| "property";

function getMemberKind(member: ts.ClassElement): MemberKind | undefined {
	if (ts.isMethodDeclaration(member)) {
		return member.body ? "method-implementation" : "method-signature";
	}
	if (ts.isPropertyDeclaration(member)) {
		return "property";
	}
	if (
		ts.isGetAccessorDeclaration(member) ||
		ts.isSetAccessorDeclaration(member)
	) {
		return "accessor";
	}
	return undefined;
}

function getMemberName(member: ts.ClassElement): string | undefined {
	if (
		!ts.isMethodDeclaration(member) &&
		!ts.isPropertyDeclaration(member) &&
		!ts.isGetAccessorDeclaration(member) &&
		!ts.isSetAccessorDeclaration(member)
	) {
		return undefined;
	}

	const { name } = member;
	if (ts.isIdentifier(name)) {
		return name.text;
	}
	if (ts.isNumericLiteral(name)) {
		return name.text;
	}
	if (ts.isPrivateIdentifier(name)) {
		return name.text;
	}
	if (ts.isStringLiteral(name)) {
		return name.text;
	}

	return undefined;
}

function hasStaticModifier(
	member:
		| ts.GetAccessorDeclaration
		| ts.MethodDeclaration
		| ts.PropertyDeclaration
		| ts.SetAccessorDeclaration,
): boolean {
	return (
		member.modifiers?.some(
			(modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword,
		) ?? false
	);
}

export default typescriptLanguage.createRule({
	about: {
		description: "Reports duplicate class member names.",
		id: "classMemberDuplicates",
		preset: "untyped",
	},
	messages: {
		duplicateMember: {
			primary:
				"This class member has the same name as a previous member and will overwrite it.",
			secondary: [
				"When class members have the same name, only the last one is preserved.",
				"This is usually a copy-paste error or indicates unfinished refactoring.",
			],
			suggestions: [
				"Rename one of the duplicate members.",
				"Remove the duplicate member if it was unintentional.",
			],
		},
	},
	setup(context) {
		function visitClass(
			node: ts.ClassDeclaration | ts.ClassExpression,
			sourceFile: ts.SourceFile,
		) {
			const staticMembers = new Map<string, MemberKind>();
			const instanceMembers = new Map<string, MemberKind>();

			for (const member of node.members) {
				if (
					!ts.isMethodDeclaration(member) &&
					!ts.isPropertyDeclaration(member) &&
					!ts.isGetAccessorDeclaration(member) &&
					!ts.isSetAccessorDeclaration(member)
				) {
					continue;
				}

				const name = getMemberName(member);
				if (!name) {
					continue;
				}

				const kind = getMemberKind(member);
				if (!kind) {
					continue;
				}

				const memberStatic = hasStaticModifier(member);
				const map = memberStatic ? staticMembers : instanceMembers;

				const existingKind = map.get(name);

				if (existingKind === undefined) {
					map.set(name, kind);
					continue;
				}

				if (kind === "accessor" && existingKind === "accessor") {
					continue;
				}

				if (
					kind === "method-signature" &&
					existingKind === "method-signature"
				) {
					continue;
				}

				if (
					kind === "method-implementation" &&
					existingKind === "method-signature"
				) {
					map.set(name, kind);
					continue;
				}

				context.report({
					message: "duplicateMember",
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
