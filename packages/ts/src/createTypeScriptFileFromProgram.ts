import {
	LanguageFileCacheImpacts,
	LanguageFileDefinition,
} from "@flint.fyi/core";
import * as ts from "typescript";

import { collectReferencedFilePaths } from "./collectReferencedFilePaths.js";
import { convertTypeScriptDiagnosticToLanguageFileDiagnostic } from "./convertTypeScriptDiagnosticToLanguageFileDiagnostic.js";
import { getFirstEnumValues } from "./getFirstEnumValues.js";
import { normalizeRange } from "./normalizeRange.js";

export const NodeSyntaxKinds = getFirstEnumValues(ts.SyntaxKind);

export function collectTypeScriptFileCacheImpacts(
	program: ts.Program,
	sourceFile: ts.SourceFile,
): LanguageFileCacheImpacts {
	return {
		dependencies: [
			// TODO: Add support for multi-TSConfig workspaces.
			// https://github.com/JoshuaKGoldberg/flint/issues/64 & more.
			"tsconfig.json",

			...collectReferencedFilePaths(program, sourceFile),
		],
	};
}

export function createTypeScriptFileFromProgram(
	program: ts.Program,
	sourceFile: ts.SourceFile,
): LanguageFileDefinition {
	return {
		cache: collectTypeScriptFileCacheImpacts(program, sourceFile),
		getDiagnostics() {
			return ts
				.getPreEmitDiagnostics(program, sourceFile)
				.map(convertTypeScriptDiagnosticToLanguageFileDiagnostic);
		},
		normalizeRange: (range) => normalizeRange(range, sourceFile),
		async runRule(runtime, options) {
			const typeChecker = program.getTypeChecker();
			const fileServices = { options, program, sourceFile, typeChecker };
			const { visitors } = runtime;

			if (visitors) {
				const visit = (node: ts.Node) => {
					visitors[NodeSyntaxKinds[node.kind]]?.(node, fileServices);
					node.forEachChild(visit);
				};

				visit(sourceFile);
			}

			await runtime.teardown?.();
		},
	};
}
