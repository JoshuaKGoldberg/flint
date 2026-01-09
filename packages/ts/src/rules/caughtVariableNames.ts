import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";

const preferredName = "error";
const descriptiveSuffixes = ["Error", "Exception", "Err"];

function isDescriptiveName(name: string): boolean {
	return descriptiveSuffixes.some((suffix) => name.endsWith(suffix));
}

function isUnused(identifier: ts.Identifier, block: ts.Block): boolean {
	const name = identifier.text;
	let used = false;

	function visit(node: ts.Node): void {
		if (used) {
			return;
		}

		if (ts.isIdentifier(node) && node.text === name && node !== identifier) {
			used = true;
			return;
		}

		ts.forEachChild(node, visit);
	}

	visit(block);
	return !used;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Enforces a consistent naming convention for catch clause error variables.",
		id: "caughtVariableNames",
		preset: "stylistic",
		strictness: "strict",
	},
	messages: {
		preferErrorName: {
			primary:
				"Use `error` as the name for the catch clause parameter instead of `{{ name }}`.",
			secondary: [
				"Consistent naming of catch clause parameters improves code readability.",
				"The name `error` clearly indicates the purpose of the variable.",
				"Descriptive names ending in 'Error' or 'Exception' are also acceptable.",
			],
			suggestions: ["Rename `{{ name }}` to `error`."],
		},
		unusedUnderscoreUsed: {
			primary:
				"The catch parameter `_` should not be used if you need to reference the error.",
			secondary: [
				"Using `_` as a parameter name conventionally indicates the value is intentionally ignored.",
				"If you need to use the caught error, rename it to `error` or a descriptive name.",
			],
			suggestions: [
				"Rename `_` to `error` if you need to use the caught value.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CatchClause: (node, { sourceFile }) => {
					const variable = node.variableDeclaration;
					if (!variable || !ts.isIdentifier(variable.name)) {
						return;
					}

					const name = variable.name.text;

					if (name === "_") {
						if (!isUnused(variable.name, node.block)) {
							context.report({
								message: "unusedUnderscoreUsed",
								range: {
									begin: variable.name.getStart(sourceFile),
									end: variable.name.getEnd(),
								},
							});
						}
						return;
					}

					if (name === preferredName || isDescriptiveName(name)) {
						return;
					}

					context.report({
						data: { name },
						message: "preferErrorName",
						range: {
							begin: variable.name.getStart(sourceFile),
							end: variable.name.getEnd(),
						},
					});
				},
			},
		};
	},
});
