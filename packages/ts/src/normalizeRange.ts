import {
	CharacterReportRange,
	getColumnAndLineOfPosition,
	NormalizedReportRangeObject,
} from "@flint.fyi/core";
import * as ts from "typescript";

export interface SourceFileLikeLoose {
	readonly text: string;
}

export function normalizeRange(
	original: CharacterReportRange,
	sourceFile: SourceFileLikeLoose,
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
