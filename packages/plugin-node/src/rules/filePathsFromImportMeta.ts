import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

function isFileURLToPathCall(node: ts.Node): node is ts.CallExpression {
	return (
		ts.isCallExpression(node) &&
		ts.isIdentifier(node.expression) &&
		node.expression.text === "fileURLToPath" &&
		node.arguments.length === 1
	);
}

function isImportMetaFilename(node: ts.Node) {
	return (
		ts.isPropertyAccessExpression(node) &&
		ts.isMetaProperty(node.expression) &&
		node.expression.keywordToken === ts.SyntaxKind.ImportKeyword &&
		ts.isIdentifier(node.expression.name) &&
		node.expression.name.text === "meta" &&
		ts.isIdentifier(node.name) &&
		node.name.text === "filename"
	);
}

function isImportMetaUrl(node: ts.Node) {
	return (
		ts.isPropertyAccessExpression(node) &&
		ts.isMetaProperty(node.expression) &&
		node.expression.keywordToken === ts.SyntaxKind.ImportKeyword &&
		ts.isIdentifier(node.expression.name) &&
		node.expression.name.text === "meta" &&
		ts.isIdentifier(node.name) &&
		node.name.text === "url"
	);
}

function isNewURLWithDot(
	node: ts.Node,
): node is ts.NewExpression & { arguments: ts.NodeArray<ts.Expression> } {
	if (
		!ts.isNewExpression(node) ||
		!ts.isIdentifier(node.expression) ||
		node.expression.text !== "URL" ||
		node.arguments?.length !== 2
	) {
		return false;
	}
	const firstArgument = node.arguments[0];
	return (
		firstArgument !== undefined &&
		ts.isStringLiteral(firstArgument) &&
		firstArgument.text === "."
	);
}

function isPathDirnameCall(node: ts.Node): node is ts.CallExpression {
	return (
		ts.isCallExpression(node) &&
		ts.isPropertyAccessExpression(node.expression) &&
		ts.isIdentifier(node.expression.expression) &&
		node.expression.expression.text === "path" &&
		ts.isIdentifier(node.expression.name) &&
		node.expression.name.text === "dirname" &&
		node.arguments.length === 1
	);
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Prefer `import.meta.dirname` and `import.meta.filename` over legacy file path techniques.",
		id: "filePathsFromImportMeta",
		preset: "stylistic",
	},
	messages: {
		preferImportMetaDirname: {
			primary:
				"Prefer `import.meta.dirname` over legacy directory path techniques.",
			secondary: [
				"Node.js 20.11 introduced `import.meta.dirname` as a direct equivalent to `path.dirname(fileURLToPath(import.meta.url))`.",
				"Using `import.meta.dirname` is more concise and doesn't require importing from `node:path` or `node:url`.",
			],
			suggestions: ["Replace with `import.meta.dirname`"],
		},
		preferImportMetaFilename: {
			primary:
				"Prefer `import.meta.filename` over `fileURLToPath(import.meta.url)`.",
			secondary: [
				"Node.js 20.11 introduced `import.meta.filename` as a direct equivalent to `fileURLToPath(import.meta.url)`.",
				"Using `import.meta.filename` is more concise and doesn't require importing from `node:url`.",
			],
			suggestions: ["Replace with `import.meta.filename`"],
		},
	},
	setup(context) {
		return {
			visitors: {
				CallExpression: (node, { sourceFile }) => {
					// Check for path.dirname(fileURLToPath(import.meta.url))
					// Check for path.dirname(import.meta.filename)
					// These must be checked first to avoid double-reporting
					if (isPathDirnameCall(node)) {
						const pathDirnameArg = node.arguments[0];
						if (
							pathDirnameArg &&
							isFileURLToPathCall(pathDirnameArg) &&
							pathDirnameArg.arguments[0] &&
							isImportMetaUrl(pathDirnameArg.arguments[0])
						) {
							context.report({
								message: "preferImportMetaDirname",
								range: getTSNodeRange(node, sourceFile),
							});
							return;
						}

						if (pathDirnameArg && isImportMetaFilename(pathDirnameArg)) {
							context.report({
								message: "preferImportMetaDirname",
								range: getTSNodeRange(node, sourceFile),
							});
							return;
						}
					}

					// Check for fileURLToPath(new URL('.', import.meta.url))
					// Check for fileURLToPath(import.meta.url)
					// This must be checked last to avoid double-reporting when inside path.dirname()
					if (isFileURLToPathCall(node)) {
						const fileURLToPathArg = node.arguments[0];
						if (
							fileURLToPathArg &&
							isNewURLWithDot(fileURLToPathArg) &&
							fileURLToPathArg.arguments[1] &&
							isImportMetaUrl(fileURLToPathArg.arguments[1])
						) {
							context.report({
								message: "preferImportMetaDirname",
								range: getTSNodeRange(node, sourceFile),
							});
							return;
						}

						if (fileURLToPathArg && isImportMetaUrl(fileURLToPathArg)) {
							// Don't report if this is inside a path.dirname call
							if (
								ts.isCallExpression(node.parent) &&
								isPathDirnameCall(node.parent) &&
								node.parent.arguments[0] === node
							) {
								return;
							}

							context.report({
								message: "preferImportMetaFilename",
								range: getTSNodeRange(node, sourceFile),
							});
							return;
						}
					}
				},
			},
		};
	},
});
