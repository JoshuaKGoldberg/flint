import type * as ts from "typescript";

import { CharacterReportRange, NormalizedReportRangeObject } from "@flint/core";

// TODO: This duplicates the packages/ts normalizeRange...
// Should there be a Flint tsutils / ts-api-utils equivalent?

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
