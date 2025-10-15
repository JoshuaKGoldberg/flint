import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import { isGlobalDeclaration } from "@flint.fyi/ts";
import * as ts from "typescript";

const globalNames = new Set(["alert", "confirm", "prompt"]);

export default typescriptLanguage.createRule({
	about: {
		description: "Reports uses of the global alert/confirm/prompt dialog APIs.",
		id: "alerts",
		preset: "logical",
	},
	messages: {
		noAlert: {
			primary:
				"The global `{{ name }}()` API blocks the main thread and interrupts users.",
			secondary: [
				"These blocking dialog APIs provide a poor user experience and are not recommended for production code.",
				"Prefer non-blocking UI or console logging for debugging instead.",
			],
			suggestions: [
				"Replace with non-blocking UI (for example a modal) or use console logging for development.",
			],
		},
	},
	setup(context) {
		function getCalleeNameAndNode(node: ts.Expression) {
			if (ts.isIdentifier(node)) {
				return { name: node.text, node };
			}

			if (ts.isPropertyAccessExpression(node)) {
				const { expression, name } = node;
				if (!ts.isIdentifier(name) || !ts.isIdentifier(expression)) {
					return undefined;
				}

				return { name: name.text, node: name };
			}

			return undefined;
		}

		return {
			visitors: {
				CallExpression(node: ts.CallExpression) {
					const found = getCalleeNameAndNode(node.expression);
					if (found === undefined) {
						return;
					}

					const { name, node: nodeToReport } = found;
					if (
						!globalNames.has(name) ||
						!isGlobalDeclaration(nodeToReport, context.typeChecker)
					) {
						return;
					}

					context.report({
						data: { name },
						message: "noAlert",
						range: getTSNodeRange(nodeToReport, context.sourceFile),
					});
				},
			},
		};
	},
});
