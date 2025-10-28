import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const methodMappings = new Map([
	["appendChild", "append"],
	["insertBefore", "prepend"],
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer modern DOM append/prepend methods over appendChild/insertBefore.",
		id: "nodeAppendMethods",
		preset: "logical",
		strictness: "strict",
	},
	messages: {
		preferModernMethod: {
			primary: "Prefer `{{ preferred }}()` over `{{ method }}()`.",
			secondary: [
				"The modern `append()` and `prepend()` methods are more flexible and readable.",
				"They accept multiple nodes and strings, while the legacy methods only accept a single Node.",
			],
			suggestions: ["Use `{{ preferred }}()` instead of `{{ method }}()`."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node: ts.CallExpression) {
					if (!ts.isPropertyAccessExpression(node.expression)) {
						return;
					}

					const { name } = node.expression;
					if (!ts.isIdentifier(name)) {
						return;
					}

					const methodName = name.text;
					const preferred = methodMappings.get(methodName);
					if (preferred === undefined) {
						return;
					}

					context.report({
						data: { method: methodName, preferred },
						message: "preferModernMethod",
						range: getTSNodeRange(name, context.sourceFile),
					});
				},
			},
		};
	},
});
