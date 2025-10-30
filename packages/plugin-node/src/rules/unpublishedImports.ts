import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import { parseJsonSafe } from "@flint.fyi/utils";
import fs from "node:fs";
import path from "node:path";
import * as ts from "typescript";

const builtinModules = new Set([
	"assert",
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
	"domain",
	"events",
	"fs",
	"http",
	"http2",
	"https",
	"inspector",
	"module",
	"net",
	"os",
	"path",
	"perf_hooks",
	"process",
	"punycode",
	"querystring",
	"readline",
	"repl",
	"stream",
	"string_decoder",
	"sys",
	"timers",
	"tls",
	"trace_events",
	"tty",
	"url",
	"util",
	"v8",
	"vm",
	"wasi",
	"worker_threads",
	"zlib",
]);

interface PackageJson {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
}

function findPackageJson(startPath: string): string | undefined {
	let currentPath = path.dirname(startPath);
	const root = path.parse(currentPath).root;

	while (currentPath !== root) {
		const packageJsonPath = path.join(currentPath, "package.json");
		if (fs.existsSync(packageJsonPath)) {
			return packageJsonPath;
		}
		currentPath = path.dirname(currentPath);
	}

	return undefined;
}

function getPackageName(moduleSpecifier: string): string {
	// Handle scoped packages like @scope/package
	if (moduleSpecifier.startsWith("@")) {
		const parts = moduleSpecifier.split("/");
		return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : moduleSpecifier;
	}

	// Handle regular packages with subpaths like package/subpath
	const firstSlash = moduleSpecifier.indexOf("/");
	return firstSlash === -1
		? moduleSpecifier
		: moduleSpecifier.substring(0, firstSlash);
}

function isBuiltinModule(moduleSpecifier: string): boolean {
	// Remove node: prefix if present
	const moduleName = moduleSpecifier.startsWith("node:")
		? moduleSpecifier.slice(5)
		: moduleSpecifier;

	// Handle subpaths like assert/strict
	const baseModule = moduleName.split("/")[0] || moduleName;

	return builtinModules.has(baseModule);
}

function isRelativePath(moduleSpecifier: string): boolean {
	return moduleSpecifier.startsWith("./") || moduleSpecifier.startsWith("../");
}

function isUnpublishedImport(
	moduleSpecifier: string,
	filePath: string,
): boolean {
	if (isRelativePath(moduleSpecifier) || isBuiltinModule(moduleSpecifier)) {
		return false;
	}

	const packageJsonPath = findPackageJson(filePath);
	if (!packageJsonPath) {
		return false;
	}

	const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
	const packageJson = parseJsonSafe(packageJsonContent) as
		| PackageJson
		| undefined;

	if (!packageJson) {
		return false;
	}

	const packageName = getPackageName(moduleSpecifier);

	// Check if it's in dependencies or peerDependencies (allowed)
	if (
		packageJson.dependencies?.[packageName] ||
		packageJson.peerDependencies?.[packageName]
	) {
		return false;
	}

	// Check if it's in devDependencies (not allowed in production code)
	if (packageJson.devDependencies?.[packageName]) {
		return true;
	}

	return false;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prevent importing modules from devDependencies in production code.",
		id: "unpublishedImports",
		preset: "logical",
	},
	messages: {
		noUnpublishedImport: {
			primary:
				"Importing from devDependencies in production code can cause runtime errors.",
			secondary: [
				"Modules in devDependencies are not installed in production environments.",
				"Move the dependency to dependencies or peerDependencies if it's needed at runtime.",
			],
			suggestions: [
				"Move the module to dependencies in package.json",
				"Move the module to peerDependencies if it's a peer dependency",
			],
		},
	},
	setup(context) {
		const filePath = context.sourceFile.fileName;

		return {
			visitors: {
				ImportDeclaration(node: ts.ImportDeclaration) {
					if (!ts.isStringLiteral(node.moduleSpecifier)) {
						return;
					}

					const moduleSpecifier = node.moduleSpecifier.text;

					if (isUnpublishedImport(moduleSpecifier, filePath)) {
						context.report({
							message: "noUnpublishedImport",
							range: getTSNodeRange(node.moduleSpecifier, context.sourceFile),
						});
					}
				},
				ImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
					if (
						!ts.isExternalModuleReference(node.moduleReference) ||
						!ts.isStringLiteral(node.moduleReference.expression)
					) {
						return;
					}

					const moduleSpecifier = node.moduleReference.expression.text;

					if (isUnpublishedImport(moduleSpecifier, filePath)) {
						context.report({
							message: "noUnpublishedImport",
							range: getTSNodeRange(
								node.moduleReference.expression,
								context.sourceFile,
							),
						});
					}
				},
			},
		};
	},
});
