import * as ts from "typescript";

export function declarationsIncludeGlobal(declarations: ts.Declaration[]) {
	return declarations.some((declaration) => {
		const sourceFile = declaration.getSourceFile();
		return (
			sourceFile.hasNoDefaultLib ||
			/\/lib\.[^/]*\.d\.ts$/.test(sourceFile.fileName)
		);
	});
}
