import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer using classList.toggle() over conditional classList.add() and classList.remove().",
		id: "classListToggles",
		preset: "stylistic",
	},
	messages: {
		preferToggle: {
			primary:
				"Prefer using `classList.toggle()` instead of conditional `classList.add()` and `classList.remove()`.",
			secondary: [
				"The `classList.toggle()` method is more concise and expressive for conditional class name changes.",
				"Using `toggle()` reduces code duplication and makes the intent clearer.",
			],
			suggestions: [
				"Replace the conditional `classList.add()` and `classList.remove()` calls with a single `classList.toggle()` call.",
			],
		},
	},
	setup() {
		function getClassListMethodCall(node: ts.Node) {
			if (!ts.isExpressionStatement(node)) {
				return undefined;
			}

			const expression = node.expression;
			if (!ts.isCallExpression(expression)) {
				return undefined;
			}

			if (!ts.isPropertyAccessExpression(expression.expression)) {
				return undefined;
			}

			const propertyAccess = expression.expression;
			const method = propertyAccess.name;

			if (
				!ts.isIdentifier(method) ||
				(method.text !== "add" && method.text !== "remove")
			) {
				return undefined;
			}

			if (!ts.isPropertyAccessExpression(propertyAccess.expression)) {
				return undefined;
			}

			const classList = propertyAccess.expression;
			if (
				!ts.isIdentifier(classList.name) ||
				classList.name.text !== "classList"
			) {
				return undefined;
			}

			const args = expression.arguments;
			if (args.length !== 1) {
				return undefined;
			}

			const arg = args[0];
			if (!ts.isStringLiteral(arg)) {
				return undefined;
			}

			return {
				className: arg.text,
				method: method.text,
				methodNode: method,
			};
		}

		function getObjectAndClassName(node: ts.Node) {
			const call = getClassListMethodCall(node);
			if (!call) {
				return undefined;
			}

			const exprStatement = node as ts.ExpressionStatement;
			const callExpr = exprStatement.expression as ts.CallExpression;
			const propertyAccess = callExpr.expression as ts.PropertyAccessExpression;
			const classList =
				propertyAccess.expression as ts.PropertyAccessExpression;
			const object = classList.expression;

			if (!ts.isIdentifier(object)) {
				return undefined;
			}

			return {
				className: call.className,
				object: object.text,
			};
		}

		return {
			visitors: {
				IfStatement(node, context) {
					const thenStatement = node.thenStatement;
					const elseStatement = node.elseStatement;

					if (!elseStatement) {
						return;
					}

					const thenBlock = ts.isBlock(thenStatement)
						? thenStatement.statements
						: [thenStatement];
					const elseBlock = ts.isBlock(elseStatement)
						? elseStatement.statements
						: [elseStatement];

					if (thenBlock.length !== 1 || elseBlock.length !== 1) {
						return;
					}

					const thenCall = getClassListMethodCall(thenBlock[0]);
					const elseCall = getClassListMethodCall(elseBlock[0]);

					if (
						!thenCall ||
						!elseCall ||
						thenCall.className !== elseCall.className
					) {
						return;
					}

					if (
						(thenCall.method === "add" && elseCall.method === "remove") ||
						(thenCall.method === "remove" && elseCall.method === "add")
					) {
						const thenInfo = getObjectAndClassName(thenBlock[0]);
						if (!thenInfo) {
							return;
						}

						const elseInfo = getObjectAndClassName(elseBlock[0]);
						if (!elseInfo || thenInfo.object !== elseInfo.object) {
							return;
						}

						const condition = node.expression;
						const sourceFile = context.sourceFile;
						const conditionText = condition.getText(sourceFile);
						const className = thenCall.className;
						const toggleSecondArg =
							thenCall.method === "add" ? conditionText : `!(${conditionText})`;

						const ifStart = node.getStart(sourceFile);
						const ifEnd = node.getEnd();

						context.report({
							fix: {
								range: {
									begin: ifStart,
									end: ifEnd,
								},
								text: `${thenInfo.object}.classList.toggle("${className}", ${toggleSecondArg});`,
							},
							message: "preferToggle",
							range: getTSNodeRange(thenCall.methodNode, sourceFile),
						});
					}
				},
			},
		};
	},
});
