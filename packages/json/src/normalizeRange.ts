import {
	CharacterReportRange,
	getColumnAndLineOfPosition,
	NormalizedReportRangeObject,
} from "@flint.fyi/core";
import type * as ts from "typescript";

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
		begin: getColumnAndLineOfPosition(sourceFile, onCharacters.begin),
		end: getColumnAndLineOfPosition(sourceFile, onCharacters.end),
	};
}

function isNode(value: unknown): value is ts.Node {
	return typeof value === "object" && value !== null && "kind" in value;
}
