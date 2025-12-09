import { runtimeBase } from "@flint.fyi/core";
import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using the deprecated __proto__ property to access or modify an object's prototype.",
		id: "objectProto",
		preset: "untyped",
	},
	messages: {
		noProto: {
			primary:
				"Use Object.getPrototypeOf or Object.setPrototypeOf instead of the deprecated __proto__ property.",
			secondary: [
				"The __proto__ property is deprecated and not part of the ECMAScript standard.",
				"It is maintained for compatibility with older browsers but can cause performance issues and unexpected behavior.",
				"Direct manipulation of an object's prototype can lead to hidden classes deoptimizations in JavaScript engines.",
			],
			suggestions: [
				"Use Object.getPrototypeOf(obj) to read the prototype of an object.",
				"Use Object.setPrototypeOf(obj, proto) to set the prototype of an object.",
				"Use Object.create(proto) when creating new objects with a specific prototype.",
			],
		},
	},
	setup() {
		return {
			...runtimeBase,
			visitors: {
				ElementAccessExpression: (node, context) => {
					if (
						ts.isStringLiteral(node.argumentExpression) &&
						node.argumentExpression.text === "__proto__"
					) {
						context.report({
							message: "noProto",
							range: {
								begin: node.argumentExpression.getStart(context.sourceFile),
								end: node.argumentExpression.getEnd(),
							},
						});
					}
				},
				PropertyAccessExpression: (node, context) => {
					if (
						node.name.kind === ts.SyntaxKind.Identifier &&
						node.name.text === "__proto__"
					) {
						context.report({
							message: "noProto",
							range: {
								begin: node.name.getStart(context.sourceFile),
								end: node.name.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
