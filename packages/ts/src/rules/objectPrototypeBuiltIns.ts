import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

const prototypeMethods = new Set([
	"hasOwnProperty",
	"isPrototypeOf",
	"propertyIsEnumerable",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports direct calls to Object.prototype methods on object instances.",
		id: "objectPrototypeBuiltIns",
		preset: "logical",
	},
	messages: {
		prototypeBuiltIn: {
			primary:
				"Prefer Object.prototype.{{ method }}.call() over calling {{ method }}() directly on objects.",
			secondary: [
				"Objects can have properties that shadow built-in methods from Object.prototype such as {{ method }}().",
				"Objects created with Object.create(null) do not inherit from Object.prototype and will not have these methods.",
				"Calling these methods directly can fail or execute unintended code if the object has shadowing properties.",
			],
			suggestions: ["Call the method through Object.prototype using .call()."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node) => {
					if (
						!ts.isPropertyAccessExpression(node.expression) ||
						!ts.isIdentifier(node.expression.name)
					) {
						return;
					}

					const methodName = node.expression.name.text;
					if (!prototypeMethods.has(methodName)) {
						return;
					}

					const objectText = context.sourceFile.text.slice(
						node.expression.expression.getStart(context.sourceFile),
						node.expression.expression.getEnd(),
					);

					const callText = context.sourceFile.text.slice(
						node.getStart(context.sourceFile),
						node.getEnd(),
					);

					const parenIndex = callText.indexOf("(");
					const argsText =
						parenIndex >= 0 ? callText.slice(parenIndex + 1, -1) : "";

					const suggestionText = `Object.prototype.${methodName}.call(${objectText}${argsText ? ", " + argsText : ""})`;

					context.report({
						data: {
							method: methodName,
						},
						message: "prototypeBuiltIn",
						range: getTSNodeRange(node, context.sourceFile),
						suggestions: [
							{
								id: "use-prototype-call",
								range: {
									begin: node.getStart(context.sourceFile),
									end: node.getEnd(),
								},
								text: suggestionText,
							},
						],
					});
				},
			},
		};
	},
});
