import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

interface GlobalSupport {
	name: string;
	supportedFrom: string;
}

// ES built-in globals and their minimum Node.js version support
const globalSupportMap: GlobalSupport[] = [
	{ name: "AggregateError", supportedFrom: "15.0.0" },
	{ name: "BigInt", supportedFrom: "10.4.0" },
	{ name: "BigInt64Array", supportedFrom: "10.4.0" },
	{ name: "BigUint64Array", supportedFrom: "10.4.0" },
	{ name: "FinalizationRegistry", supportedFrom: "14.6.0" },
	{ name: "WeakRef", supportedFrom: "14.6.0" },
	{ name: "globalThis", supportedFrom: "12.0.0" },
];

const globalNamesSet = new Set(globalSupportMap.map((g) => g.name));

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallow ES built-in globals that are unsupported in older Node.js versions.",
		id: "unsupportedGlobals",
		preset: "logical",
	},
	messages: {
		unsupportedGlobal: {
			primary:
				"The global `{{ name }}` is not supported in Node.js versions before {{ version }}.",
			secondary: [
				"Using unsupported globals will cause runtime errors in older Node.js versions.",
				"Consider using a polyfill or checking for feature availability before use.",
			],
			suggestions: [
				"Use a polyfill for the unsupported feature",
				"Check for feature availability with `typeof {{ name }} !== 'undefined'`",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				Identifier(node: ts.Identifier) {
					if (!globalNamesSet.has(node.text)) {
						return;
					}

					const parent = node.parent;

					// Don't report if it's a property name in an object literal (e.g., { BigInt: ... })
					if (ts.isPropertyAssignment(parent) && parent.name === node) {
						return;
					}

					// Don't report if it's a property access (e.g., obj.BigInt)
					if (ts.isPropertyAccessExpression(parent) && parent.name === node) {
						return;
					}

					// Don't report if it's the name being declared
					if (ts.isVariableDeclaration(parent) && parent.name === node) {
						return;
					}

					// Don't report if it's a parameter, function, or class name
					if (
						ts.isParameter(parent) ||
						ts.isFunctionDeclaration(parent) ||
						ts.isClassDeclaration(parent)
					) {
						return;
					}

					// Don't report if inside a typeof check
					let current: ts.Node | undefined = parent;
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					while (current !== undefined) {
						if (ts.isTypeOfExpression(current)) {
							return;
						}
						// Stop if we hit a statement boundary
						if (ts.isStatement(current)) {
							break;
						}
						current = current.parent;
					}

					const global = globalSupportMap.find((g) => g.name === node.text);
					if (global) {
						context.report({
							data: {
								name: global.name,
								version: global.supportedFrom,
							},
							message: "unsupportedGlobal",
							range: getTSNodeRange(node, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
