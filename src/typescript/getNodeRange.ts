import type * as ts from "typescript";

import { CharacterReportRange } from "../types/ranges.js";

export function getNodeRange(
	node: ts.Node,
	sourceFile: ts.SourceFile,
): CharacterReportRange {
	return {
		begin: node.getStart(sourceFile),
		end: node.getEnd(),
	};
}
