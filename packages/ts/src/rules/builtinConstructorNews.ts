import * as ts from "typescript";

import { typescriptLanguage } from "../language.ts";
import { isGlobalDeclarationOfName } from "../utils/isGlobalDeclarationOfName.ts";

const requiresNew = new Set([
	"Array",
	"ArrayBuffer",
	"BigInt64Array",
	"BigUint64Array",
	"DataView",
	"Date",
	"Error",
	"FinalizationRegistry",
	"Float16Array",
	"Float32Array",
	"Float64Array",
	"Function",
	"Int8Array",
	"Int16Array",
	"Int32Array",
	"Map",
	"Object",
	"Promise",
	"Proxy",
	"RegExp",
	"Set",
	"SharedArrayBuffer",
	"Uint8Array",
	"Uint8ClampedArray",
	"Uint16Array",
	"Uint32Array",
	"WeakMap",
	"WeakRef",
	"WeakSet",
]);

const disallowsNew = new Set([
	"BigInt",
	"Boolean",
	"Number",
	"String",
	"Symbol",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Enforces using new for constructors that require it, and disallows new for primitive coercion functions.",
		id: "builtinConstructorNews",
		preset: "stylistic",
	},
	messages: {
		disallowNew: {
			primary: "Use {{ name }}() without new to coerce values to primitives.",
			secondary: [
				"Using `new` with `{{ name }}` creates an object wrapper around the primitive value.",
				"Object wrappers can cause unexpected behavior in comparisons and type checks.",
			],
			suggestions: ["Remove `new` to use {{ name }} as a coercion function."],
		},
		requireNew: {
			primary: "Use new {{ name }}() to create instances.",
			secondary: [
				"Built-in constructors like `{{ name }}` should be called with `new` for consistency.",
				"While some constructors work without `new`, using `new` makes the intent clearer.",
			],
			suggestions: ["Add `new` before {{ name }}()."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile, typeChecker }) => {
					if (!ts.isIdentifier(node.expression)) {
						return;
					}

					const name = node.expression.text;
					if (!requiresNew.has(name)) {
						return;
					}

					if (!isGlobalDeclarationOfName(node.expression, name, typeChecker)) {
						return;
					}

					context.report({
						data: { name },
						message: "requireNew",
						range: {
							begin: node.expression.getStart(sourceFile),
							end: node.expression.getEnd(),
						},
					});
				},
				NewExpression: (node, { sourceFile, typeChecker }) => {
					if (!ts.isIdentifier(node.expression)) {
						return;
					}

					const name = node.expression.text;
					if (!disallowsNew.has(name)) {
						return;
					}

					if (!isGlobalDeclarationOfName(node.expression, name, typeChecker)) {
						return;
					}

					context.report({
						data: { name },
						message: "disallowNew",
						range: {
							begin: node.getStart(sourceFile),
							end: node.expression.getEnd(),
						},
					});
				},
			},
		};
	},
});
