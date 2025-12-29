import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

// List of Node.js built-in modules that should use the node: protocol
// Based on Node.js documentation: https://nodejs.org/api/
const nodeBuiltinModules = new Set([
	"assert",
	"assert/strict",
	"async_hooks",
	"buffer",
	"child_process",
	"cluster",
	"console",
	"constants",
	"crypto",
	"dgram",
	"diagnostics_channel",
	"dns",
	"dns/promises",
	"domain",
	"events",
	"fs",
	"fs/promises",
	"http",
	"http2",
	"https",
	"inspector",
	"inspector/promises",
	"module",
	"net",
	"os",
	"path",
	"path/posix",
	"path/win32",
	"perf_hooks",
	"process",
	"punycode",
	"querystring",
	"readline",
	"readline/promises",
	"repl",
	"stream",
	"stream/consumers",
	"stream/promises",
	"stream/web",
	"string_decoder",
	"sys",
	"timers",
	"timers/promises",
	"tls",
	"trace_events",
	"tty",
	"url",
	"util",
	"util/types",
	"v8",
	"vm",
	"wasi",
	"worker_threads",
	"zlib",
]);

function hasNodeProtocol(moduleName: string): boolean {
	return moduleName.startsWith("node:");
}

function isNodeBuiltinModule(moduleName: string): boolean {
	// Check if it's a built-in module without the node: prefix
	return nodeBuiltinModules.has(moduleName);
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer the `node:` protocol prefix for Node.js built-in modules for clarity and consistency.",
		id: "nodeProtocols",
		preset: "logical",
	},
	messages: {
		preferNodeProtocol: {
			primary: "Prefer `node:{{ moduleName }}` over `{{ moduleName }}`.",
			secondary: [
				"The `node:` protocol makes it explicit that the module is a Node.js built-in.",
				"This prevents confusion with npm packages that might have the same name.",
				"The protocol is supported in Node.js 16+ and is the recommended way to import built-ins.",
			],
			suggestions: ["Use the `node:` protocol prefix for built-in modules."],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression(node: ts.CallExpression) {
					// Handle require() calls
					if (
						ts.isIdentifier(node.expression) &&
						node.expression.text === "require" &&
						node.arguments.length > 0
					) {
						const firstArg = node.arguments[0];
						if (ts.isStringLiteral(firstArg)) {
							const moduleName = firstArg.text;
							if (
								isNodeBuiltinModule(moduleName) &&
								!hasNodeProtocol(moduleName)
							) {
								context.report({
									data: { moduleName },
									message: "preferNodeProtocol",
									range: getTSNodeRange(firstArg, context.sourceFile),
								});
							}
						}
					}
				},
				ImportDeclaration(node: ts.ImportDeclaration) {
					if (!ts.isStringLiteral(node.moduleSpecifier)) {
						return;
					}

					const moduleName = node.moduleSpecifier.text;
					if (isNodeBuiltinModule(moduleName) && !hasNodeProtocol(moduleName)) {
						context.report({
							data: { moduleName },
							message: "preferNodeProtocol",
							range: getTSNodeRange(node.moduleSpecifier, context.sourceFile),
						});
					}
				},
				ImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
					if (
						ts.isExternalModuleReference(node.moduleReference) &&
						ts.isStringLiteral(node.moduleReference.expression)
					) {
						const moduleName = node.moduleReference.expression.text;
						if (
							isNodeBuiltinModule(moduleName) &&
							!hasNodeProtocol(moduleName)
						) {
							context.report({
								data: { moduleName },
								message: "preferNodeProtocol",
								range: getTSNodeRange(
									node.moduleReference.expression,
									context.sourceFile,
								),
							});
						}
					}
				},
			},
		};
	},
});
