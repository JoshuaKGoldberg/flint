import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

function hasFileExtension(path: string): boolean {
	// Check if the path has a file extension (e.g., .js, .ts, .json, etc.)
	const lastDotIndex = path.lastIndexOf(".");
	const lastSlashIndex = Math.max(
		path.lastIndexOf("/"),
		path.lastIndexOf("\\"),
	);

	// Extension exists if there's a dot after the last slash
	return lastDotIndex > lastSlashIndex && lastDotIndex !== -1;
}

function isRelativePath(path: string): boolean {
	return path.startsWith(".") || path.startsWith("..");
}

function shouldCheckImportPath(moduleSpecifier: ts.Expression): boolean {
	if (!ts.isStringLiteral(moduleSpecifier)) {
		return false;
	}

	const path = moduleSpecifier.text;

	// Only check relative paths
	if (!isRelativePath(path)) {
		return false;
	}

	// Check if it already has an extension
	return !hasFileExtension(path);
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Require file extensions in import and export statements for local files.",
		id: "importFileExtensions",
		preset: "logical",
	},
	messages: {
		missingExtension: {
			primary:
				"Import and export statements should include file extensions for local files.",
			secondary: [
				"Node.js ESM requires file extensions in import specifiers.",
				"Including extensions makes imports explicit and improves compatibility with ES modules.",
			],
			suggestions: [
				"Add a file extension like `.js`, `.mjs`, `.cjs`, or `.json` to the import path",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				ExportDeclaration(node: ts.ExportDeclaration) {
					if (
						node.moduleSpecifier &&
						shouldCheckImportPath(node.moduleSpecifier)
					) {
						context.report({
							message: "missingExtension",
							range: getTSNodeRange(node.moduleSpecifier, context.sourceFile),
						});
					}
				},
				ImportDeclaration(node: ts.ImportDeclaration) {
					if (shouldCheckImportPath(node.moduleSpecifier)) {
						context.report({
							message: "missingExtension",
							range: getTSNodeRange(node.moduleSpecifier, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
