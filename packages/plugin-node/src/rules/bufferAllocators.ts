import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer modern Buffer allocation methods over the deprecated Buffer constructor.",
		id: "bufferAllocators",
		preset: "logical",
	},
	messages: {
		useBufferAllocators: {
			primary:
				"Prefer `Buffer.from()` or `Buffer.alloc()` over the deprecated `new Buffer()` constructor.",
			secondary: [
				"The `new Buffer()` constructor has been deprecated since Node.js 4 due to security and usability concerns.",
				"Use `Buffer.from()` for creating a Buffer from existing data (strings, arrays, or ArrayBuffers).",
				"Use `Buffer.alloc()` for creating a Buffer of a specific size with zero-filled memory.",
			],
			suggestions: [
				"Use `Buffer.from()` for creating buffers from existing data",
				"Use `Buffer.alloc()` for creating zero-filled buffers of a specific size",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				NewExpression(node: ts.NewExpression) {
					if (
						!ts.isIdentifier(node.expression) ||
						node.expression.text !== "Buffer"
					) {
						return;
					}

					context.report({
						message: "useBufferAllocators",
						range: getTSNodeRange(node, context.sourceFile),
					});
				},
			},
		};
	},
});
