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
				"Use Object.prototype.{{ method }}.call() instead of calling {{ method }} directly on an object.",
			secondary: [
				"Objects can have properties that shadow built-in methods from Object.prototype.",
				"Calling these methods directly can fail if the object was created with Object.create(null) or has shadowing properties.",
				"Always call these methods through Object.prototype to ensure they work correctly.",
			],
			suggestions: [
				"Use Object.prototype.{{ method }}.call(obj, ...) to safely call the method.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node) => {
					if (!ts.isPropertyAccessExpression(node.expression)) {
						return;
					}

					if (!ts.isIdentifier(node.expression.name)) {
						return;
					}

					const methodName = node.expression.name.text;

					if (!prototypeMethods.has(methodName)) {
						return;
					}

					context.report({
						data: {
							method: methodName,
						},
						message: "prototypeBuiltIn",
						range: getTSNodeRange(node.expression.name, context.sourceFile),
					});
				},
			},
		};
	},
});
