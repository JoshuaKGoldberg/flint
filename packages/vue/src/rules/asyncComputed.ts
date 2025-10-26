import ts from "typescript";
import * as tsutils from "ts-api-utils";
import { vueLanguage } from "../index.js";
import { isPromiseLike } from "../../../ts/lib/rules/utils/builtinSymbolLikes.js";
import { isTypeRecursive } from "../../../ts/lib/rules/utils/isTypeRecursive.js";

export default vueLanguage.createRule({
	about: {
		id: "asyncComputed",
		description: "Reports asynchronous functions in computed properties.",
		preset: "logical",
	},
	messages: {
		async: {
			primary:
				"Asynchronous functions in computed properties can lead to loss of reactivity.",
			secondary: [
				"Computed properties must be synchronous to maintain the reactive data flow.",
				"Using async functions can cause computed properties to return promises, disrupting the reactivity system.",
			],
			suggestions: [
				"Consider using watches for asynchronous operations instead of computed properties.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node: ts.CallExpression) {
					if (!isComputed(context.typeChecker, node)) {
						return;
					}

					const type = context.typeChecker.getTypeAtLocation(node);
					if (!tsutils.isTypeReference(type)) {
						return;
					}

					// declare function computed<T, S>(...): ...
					const [getterType] = context.typeChecker.getTypeArguments(type);
					if (getterType == null) {
						return;
					}

					if (
						!isTypeRecursive(getterType, (type) =>
							isPromiseLike(context.program, type),
						)
					) {
						return;
					}

					const reportNode = node.arguments[0] ?? node.expression;

					context.report({
						range: {
							begin: reportNode.getStart(context.sourceFile),
							end: reportNode.getEnd(),
						},
						message: "async",
					});
				},
			},
		};
	},
});

function isComputed(
	typeChecker: ts.TypeChecker,
	node: ts.CallExpression,
): boolean {
	const callee = node.expression;
	if (!ts.isIdentifier(callee) || callee.text !== "computed") {
		return false;
	}

	const type = typeChecker.getTypeAtLocation(callee);

	if (type.symbol?.declarations == null) {
		return false;
	}

	for (const decl of type.symbol.declarations) {
		if (
			decl.getSourceFile().fileName.includes("/node_modules/@vue/reactivity/")
		) {
			return true;
		}
	}

	return false;
}
