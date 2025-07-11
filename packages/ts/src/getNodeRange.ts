import type * as ts from "typescript";

import { CharacterReportRange } from "@flint/core";

export function getNodeRange(
	node: ts.Node,
	sourceFile: ts.SourceFile,
): CharacterReportRange {
	return {
		begin: node.getStart(sourceFile),
		end: node.getEnd(),
	};
}
