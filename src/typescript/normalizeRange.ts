import type * as ts from "typescript";

import { NormalizedReportRangeObject } from "../types/reports.js";
import { CharacterReportRange } from "../types/ranges.js";

export function normalizeRange(
	original: CharacterReportRange,
	sourceFile: ts.SourceFile,
): NormalizedReportRangeObject {
	const onCharacters = isNode(original)
		? { begin: original.getStart(), end: original.getEnd() }
		: original;

	return {
		begin: normalizeRangePosition(onCharacters.begin, sourceFile),
		end: normalizeRangePosition(onCharacters.end, sourceFile),
	};
}

function isNode(value: unknown): value is ts.Node {
	return typeof value === "object" && value !== null && "kind" in value;
}

function normalizeRangePosition(raw: number, sourceFile: ts.SourceFile) {
	const { character, line } = sourceFile.getLineAndCharacterOfPosition(raw);

	return { column: character, line, raw };
}
