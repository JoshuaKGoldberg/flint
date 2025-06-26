import * as path from "node:path";
import * as ts from "typescript";

export function retrievedReferencedFilePaths(
	program: ts.Program,
	sourceFile: ts.SourceFile,
) {
	// TODO: Also handle await import()s
	return sourceFile.statements
		.filter(isImportDeclarationWithStringLiteral)
		.map((statement) => {
			const resolved = ts.resolveModuleName(
				statement.moduleSpecifier.text,
				sourceFile.fileName,
				program.getCompilerOptions(),
				// TODO: Eventually, the file system should be abstracted
				// https://github.com/JoshuaKGoldberg/flint/issues/73
				ts.sys,
			);

			return (
				resolved.resolvedModule?.isExternalLibraryImport === false &&
				path.relative(process.cwd(), resolved.resolvedModule.resolvedFileName)
			);
		})
		.filter((resolvedFileName) => resolvedFileName !== false);
}

function isImportDeclarationWithStringLiteral(
	statement: ts.Statement,
): statement is ts.ImportDeclaration & { moduleSpecifier: ts.StringLiteral } {
	return (
		ts.isImportDeclaration(statement) &&
		ts.isStringLiteral(statement.moduleSpecifier)
	);
}
