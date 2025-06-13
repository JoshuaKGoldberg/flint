import type * as ts from "typescript";

import { CharacterReportRange } from "../types/reports.js";

export function getNodeRange(node: ts.Node): CharacterReportRange {
	return {
		begin: node.getStart(),
		end: node.getEnd(),
	};
}
