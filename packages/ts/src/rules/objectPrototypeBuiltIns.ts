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
				"Prefer the safer `Object.prototype.{{ method }}.call()` over calling `{{ method }}()` directly on objects.",
			secondary: [
				"Objects can have properties that shadow built-in methods from `Object.prototype` such as `{{ method }}()`.",
				"Objects created with `Object.create(null)` do not inherit from `Object.prototype` and will not have these methods.",
				"Calling these methods directly can fail or execute unintended code if the object has shadowing properties.",
			],
			suggestions: [
				"Call the method through `Object.prototype` using `.call()`.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile }) => {
					if (
						!ts.isPropertyAccessExpression(node.expression) ||
						!ts.isIdentifier(node.expression.name)
					) {
						return;
					}

					const method = node.expression.name.text;
					if (!prototypeMethods.has(method)) {
						return;
					}

					const objectText = sourceFile.text.slice(
						node.expression.expression.getStart(sourceFile),
						node.expression.expression.getEnd(),
					);

					const callText = sourceFile.text.slice(
						node.getStart(sourceFile),
						node.getEnd(),
					);

					const parenthesisIndex = callText.indexOf("(");
					const argsText =
						parenthesisIndex >= 0 && callText.slice(parenthesisIndex + 1, -1);

					const suggestionText = `Object.prototype.${method}.call(${objectText}${argsText ? ", " + argsText : ""})`;

					context.report({
						data: { method },
						message: "prototypeBuiltIn",
						range: getTSNodeRange(node, sourceFile),
						suggestions: [
							{
								id: "use-prototype-call",
								range: {
									begin: node.getStart(sourceFile),
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
