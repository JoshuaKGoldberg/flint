import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const oldMethodNames = new Set([
	"insertAdjacentElement",
	"insertAdjacentText",
	"insertBefore",
	"replaceChild",
]);

const insertAdjacentPositionMap: Record<string, string> = {
	afterbegin: "prepend",
	afterend: "after",
	beforebegin: "before",
	beforeend: "append",
};

function getPropertyAccessInfo(node: ts.Expression) {
	if (!ts.isPropertyAccessExpression(node)) {
		return undefined;
	}

	const { expression, name } = node;
	if (!ts.isIdentifier(name)) {
		return undefined;
	}

	return { expression, methodName: name.text, nameNode: name };
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer modern DOM APIs like .replaceWith() and .before() over legacy methods like .replaceChild() and .insertBefore().",
		id: "nodeModificationMethods",
		preset: "logical",
	},
	messages: {
		preferAfter: {
			primary:
				"Prefer `.after()` over `.insertAdjacentElement('afterend', ...)` or `.insertAdjacentText('afterend', ...)`.",
			secondary: [
				"The modern .after() method is simpler and more intuitive than insertAdjacentElement/insertAdjacentText with the 'afterend' position.",
				"It does not require traversing to the parent node and can accept multiple nodes or strings at once.",
			],
			suggestions: ["Replace with `.after()`."],
		},
		preferAppend: {
			primary:
				"Prefer `.append()` over `.insertAdjacentElement('beforeend', ...)` or `.insertAdjacentText('beforeend', ...)`.",
			secondary: [
				"The modern .append() method is simpler and more intuitive than insertAdjacentElement/insertAdjacentText with the 'beforeend' position.",
				"It does not require traversing to the parent node and can accept multiple nodes or strings at once.",
			],
			suggestions: ["Replace with `.append()`."],
		},
		preferBefore: {
			primary:
				"Prefer `.before()` over `.insertBefore()`, `.insertAdjacentElement('beforebegin', ...)`, or `.insertAdjacentText('beforebegin', ...)`.",
			secondary: [
				"The modern .before() method is simpler and more intuitive than the legacy insertBefore or insertAdjacentElement/insertAdjacentText methods.",
				"It does not require traversing to the parent node and can accept multiple nodes or strings at once.",
			],
			suggestions: ["Replace with `.before()`."],
		},
		preferPrepend: {
			primary:
				"Prefer `.prepend()` over `.insertAdjacentElement('afterbegin', ...)` or `.insertAdjacentText('afterbegin', ...)`.",
			secondary: [
				"The modern .prepend() method is simpler and more intuitive than insertAdjacentElement/insertAdjacentText with the 'afterbegin' position.",
				"It does not require traversing to the parent node and can accept multiple nodes or strings at once.",
			],
			suggestions: ["Replace with `.prepend()`."],
		},
		preferReplaceWith: {
			primary: "Prefer `.replaceWith()` over `.replaceChild()`.",
			secondary: [
				"The modern .replaceWith() method is simpler and called directly on the node being replaced.",
				"It does not require traversing to the parent node and can accept multiple nodes or strings at once.",
			],
			suggestions: ["Replace with `.replaceWith()`."],
		},
	},
	setup(context) {
		function checkCallExpression(node: ts.CallExpression) {
			const propertyInfo = getPropertyAccessInfo(node.expression);
			if (propertyInfo === undefined) {
				return;
			}

			const { methodName, nameNode } = propertyInfo;
			if (!oldMethodNames.has(methodName)) {
				return;
			}

			if (methodName === "replaceChild") {
				context.report({
					message: "preferReplaceWith",
					range: getTSNodeRange(nameNode, context.sourceFile),
				});
				return;
			}

			if (methodName === "insertBefore") {
				context.report({
					message: "preferBefore",
					range: getTSNodeRange(nameNode, context.sourceFile),
				});
				return;
			}

			if (
				methodName === "insertAdjacentElement" ||
				methodName === "insertAdjacentText"
			) {
				const firstArgument = node.arguments[0];
				if (!firstArgument || !ts.isStringLiteral(firstArgument)) {
					return;
				}

				const position = firstArgument.text.toLowerCase();
				const modernMethod = insertAdjacentPositionMap[position];

				if (modernMethod === "before") {
					context.report({
						message: "preferBefore",
						range: getTSNodeRange(nameNode, context.sourceFile),
					});
				} else if (modernMethod === "after") {
					context.report({
						message: "preferAfter",
						range: getTSNodeRange(nameNode, context.sourceFile),
					});
				} else if (modernMethod === "prepend") {
					context.report({
						message: "preferPrepend",
						range: getTSNodeRange(nameNode, context.sourceFile),
					});
				} else if (modernMethod === "append") {
					context.report({
						message: "preferAppend",
						range: getTSNodeRange(nameNode, context.sourceFile),
					});
				}
			}
		}

		return {
			visitors: {
				CallExpression: checkCallExpression,
			},
		};
	},
});
