import { LanguageFileDefinition } from "@flint.fyi/core";
import * as ts from "typescript";

import { collectReferencedFilePaths } from "./collectReferencedFilePaths.js";
import { formatDiagnostic } from "./formatDiagnostic.js";
import { getFirstEnumValues } from "./getFirstEnumValues.js";
import { normalizeRange } from "./normalizeRange.js";

const NodeSyntaxKinds = getFirstEnumValues(ts.SyntaxKind);

export function createTypeScriptFileFromProgram(
	program: ts.Program,
	sourceFile: ts.SourceFile,
): LanguageFileDefinition {
	return {
		cache: {
			dependencies: [
				// TODO: Add support for multi-TSConfig workspaces.
				// https://github.com/JoshuaKGoldberg/flint/issues/64 & more.
				"tsconfig.json",

				...collectReferencedFilePaths(program, sourceFile),
			],
		},
		getDiagnostics() {
			return ts
				.getPreEmitDiagnostics(program, sourceFile)
				.map((diagnostic) => ({
					code: `TS${diagnostic.code}`,
					text: formatDiagnostic({
						...diagnostic,
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						length: diagnostic.length!,
						message: ts.flattenDiagnosticMessageText(
							diagnostic.messageText,
							"\n",
						),
						name: `TS${diagnostic.code}`,
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						start: diagnostic.start!,
					}),
				}));
		},
		// context:
		// sourceFile,
		// typeChecker: program.getTypeChecker(),
		normalizeRange: (range) => normalizeRange(range, sourceFile),
		runRule(runtime, options) {
			const { visitors } = runtime;
			if (!visitors) {
				return;
			}

			const typeChecker = program.getTypeChecker();
			const fileServices = { options, program, sourceFile, typeChecker };

			const visit = (node: ts.Node) => {
				visitors[NodeSyntaxKinds[node.kind]]?.(node, fileServices);
				node.forEachChild(visit);
			};

			visit(sourceFile);
		},
	};
}
