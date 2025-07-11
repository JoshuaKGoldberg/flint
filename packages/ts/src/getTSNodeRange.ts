import type * as ts from "typescript";

import { CharacterReportRange } from "@flint.fyi/core";

export function getTSNodeRange(
	node: ts.Node,
	sourceFile: ts.SourceFile,
): CharacterReportRange {
	return {
		begin: node.getStart(sourceFile),
		end: node.getEnd(),
	};
}
