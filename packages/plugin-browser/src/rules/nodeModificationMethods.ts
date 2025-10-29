import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

type ModernMethodName = "after" | "append" | "before" | "prepend";

const insertAdjacentPositionMap: Record<string, ModernMethodName> = {
	afterbegin: "prepend",
	afterend: "after",
	beforebegin: "before",
	beforeend: "append",
};

function getModernMethodName(methodName: string, node: ts.CallExpression) {
	switch (methodName) {
		case "insertAdjacentElement":
		case "insertAdjacentText": {
			const firstArgument = node.arguments[0];
			if (!ts.isStringLiteral(firstArgument)) {
				return undefined;
			}

			const position = firstArgument.text.toLowerCase();
			return insertAdjacentPositionMap[position];
		}

		case "insertBefore":
			return "before";

		case "replaceChild":
			return "replaceWith";
	}
}

function getPropertyNameNode(node: ts.Expression) {
	if (!ts.isPropertyAccessExpression(node)) {
		return undefined;
	}

	if (!ts.isIdentifier(node.name)) {
		return undefined;
	}

	return node.name;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer modern DOM APIs like .replaceWith() and .before() over legacy methods like .replaceChild() and .insertBefore().",
		id: "nodeModificationMethods",
		preset: "logical",
	},
	messages: {
		after: {
			primary:
				"Prefer `.after()` over `.insertAdjacentElement('afterend', ...)` or `.insertAdjacentText('afterend', ...)`.",
			secondary: [
				"The modern .after() method is simpler and more intuitive than insertAdjacentElement/insertAdjacentText with the 'afterend' position.",
				"It does not require traversing to the parent node and can accept multiple nodes or strings at once.",
			],
			suggestions: ["Replace with `.after()`."],
		},
		append: {
			primary:
				"Prefer `.append()` over `.insertAdjacentElement('beforeend', ...)` or `.insertAdjacentText('beforeend', ...)`.",
			secondary: [
				"The modern .append() method is simpler and more intuitive than insertAdjacentElement/insertAdjacentText with the 'beforeend' position.",
				"It does not require traversing to the parent node and can accept multiple nodes or strings at once.",
			],
			suggestions: ["Replace with `.append()`."],
		},
		before: {
			primary:
				"Prefer `.before()` over `.insertBefore()`, `.insertAdjacentElement('beforebegin', ...)`, or `.insertAdjacentText('beforebegin', ...)`.",
			secondary: [
				"The modern .before() method is simpler and more intuitive than the legacy insertBefore or insertAdjacentElement/insertAdjacentText methods.",
				"It does not require traversing to the parent node and can accept multiple nodes or strings at once.",
			],
			suggestions: ["Replace with `.before()`."],
		},
		prepend: {
			primary:
				"Prefer `.prepend()` over `.insertAdjacentElement('afterbegin', ...)` or `.insertAdjacentText('afterbegin', ...)`.",
			secondary: [
				"The modern .prepend() method is simpler and more intuitive than insertAdjacentElement/insertAdjacentText with the 'afterbegin' position.",
				"It does not require traversing to the parent node and can accept multiple nodes or strings at once.",
			],
			suggestions: ["Replace with `.prepend()`."],
		},
		replaceWith: {
			primary: "Prefer `.replaceWith()` over `.replaceChild()`.",
			secondary: [
				"The modern .replaceWith() method is simpler and called directly on the node being replaced.",
				"It does not require traversing to the parent node and can accept multiple nodes or strings at once.",
			],
			suggestions: ["Replace with `.replaceWith()`."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node) {
					const nameNode = getPropertyNameNode(node.expression);
					if (nameNode === undefined) {
						return;
					}

					const modernMethod = getModernMethodName(nameNode.text, node);
					if (!modernMethod) {
						return undefined;
					}

					context.report({
						message: modernMethod,
						range: getTSNodeRange(nameNode, context.sourceFile),
					});
				},
			},
		};
	},
});
