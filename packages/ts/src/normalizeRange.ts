import {
	CharacterReportRange,
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
		begin: normalizeRangePosition(onCharacters.begin, sourceFile),
		end: normalizeRangePosition(onCharacters.end, sourceFile),
	};
}

function isNode(value: unknown): value is ts.Node {
	return typeof value === "object" && value !== null && "kind" in value;
}

// Internally, the SourceFileLike interface declares getLineAndCharacterOfPosition
// as an optional field [1]. However, it is later made required through module augmentation[2].
// Despite that, ts.getLineAndCharacterOfPosition never accesses sourceFile.getLineAndCharacterOfPosition [3].
// Therefore, it's safe to pass SourceFileLikeLoose here.
//
// We don't pass the raw text directly, because when sourceFile is a ts.SourceFile,
// it may contain a precomputed lineMap, which helps avoid recalculating it.
//
// [1] https://github.com/microsoft/TypeScript/blob/af3a3779de6bc27619c85077e1b4d1de8feddd35/src/compiler/types.ts#L4290
// [2] https://github.com/microsoft/TypeScript/blob/af3a3779de6bc27619c85077e1b4d1de8feddd35/src/services/types.ts#L178-L183
// [3] https://github.com/microsoft/TypeScript/blob/af3a3779de6bc27619c85077e1b4d1de8feddd35/src/compiler/scanner.ts#L503-L505
export function getLineAndCharacterOfPosition(
	sourceFile: SourceFileLikeLoose,
	position: number,
) {
	return ts.getLineAndCharacterOfPosition(
		sourceFile as ts.SourceFileLike,
		position,
	);
}
export function getPositionOfLineAndCharacter(
	sourceFile: SourceFileLikeLoose,
	line: number,
	character: number,
) {
	return ts.getPositionOfLineAndCharacter(
		sourceFile as ts.SourceFileLike,
		line,
		character,
	);
}

function normalizeRangePosition(raw: number, sourceFile: SourceFileLikeLoose) {
	const { character, line } = getLineAndCharacterOfPosition(sourceFile, raw);

	return { column: character, line, raw };
}
