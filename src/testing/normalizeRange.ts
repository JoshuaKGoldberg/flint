import type * as ts from "typescript";

import { ReportRange } from "../types/reports.js";

export function normalizeRange(range: ReportRange) {
	return isNode(range)
		? { begin: range.getStart(), end: range.getEnd() }
		: range;
}

function isNode(value: unknown): value is ts.Node {
	return typeof value === "object" && value !== null && "kind" in value;
}
