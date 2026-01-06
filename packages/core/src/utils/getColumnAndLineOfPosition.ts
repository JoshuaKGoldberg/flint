import type {
	ColumnAndLine,
	ColumnAndLineWithoutRaw,
} from "../types/ranges.ts";
import { binarySearch } from "./arrays.ts";

/** Subset of ts.SourceFileLike */
export interface HasGetLineAndCharacterOfPosition {
	getLineAndCharacterOfPosition(position: number): TSLineAndCharacter;
}

export interface SourceFileWithLineMap {
	readonly text: string;
	/** Used for caching the start positions of lines in `text` */
	lineMap?: readonly number[];
}

export interface SourceFileWithLineMapAndFileName extends SourceFileWithLineMap {
	fileName: string;
}

/**
 * Structurally the same as ts.LineAndCharacter.
 * It's duplicated because `@flint.fyi/core` doesn't have a dependency on `typescript`.
 */
export interface TSLineAndCharacter {
	/** 0-based. */
	character: number;
	line: number;
}

/**
 * Prefer passing a `source` of type `HasGetLineAndCharacterOfPosition` or `SourceFileWithLineMap`.
 * This way, the expensive computation of the `lineMap` will be cached across multiple calls.
 */
export function getColumnAndLineOfPosition(
	source: HasGetLineAndCharacterOfPosition | SourceFileWithLineMap | string,
	position: number,
): ColumnAndLine {
	if (typeof source === "string") {
		return computeColumnAndLineOfPosition(
			source,
			computeLineStarts(source),
			position,
		);
	}
	if ("getLineAndCharacterOfPosition" in source) {
		const { character, line } = source.getLineAndCharacterOfPosition(position);
		return { column: character, line, raw: position };
	}
	source.lineMap ??= computeLineStarts(source.text);
	return computeColumnAndLineOfPosition(source.text, source.lineMap, position);
}

function computeColumnAndLineOfPosition(
	source: string,
	lineStarts: readonly number[],
	position: number,
): ColumnAndLine {
	if (position < 0) {
		return {
			column: 0,
			line: 0,
			raw: 0,
		};
	}
	if (position > source.length) {
		const line = lineStarts.length - 1;
		return {
			// line is bounded by the length check above
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			column: Math.max(source.length - lineStarts[line]!, 0),
			line,
			raw: Math.max(source.length - 1, 0),
		};
	}
	const { element: lineStart, index: line } = binarySearch(
		lineStarts,
		(start) => (start < position ? -1 : start > position ? 1 : 0),
		"fallback-prev",
	);

	return {
		// At this point, position is always >0, and lineStarts is always
		// non-empty, so with "fallback-prev", binarySearch always returns
		// a non-undefined element.
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		column: position - lineStart!,
		line,
		raw: position,
	};
}
function computeLineStarts(source: string): readonly number[] {
	const res = [];
	let lineStart = 0;
	let cr = source.indexOf("\r", lineStart);
	let lf = source.indexOf("\n", lineStart);
	while (true) {
		if (lf === -1) {
			while (cr !== -1) {
				res.push(lineStart);
				lineStart = cr + 1;
				cr = source.indexOf("\r", lineStart);
			}
			break;
		}
		if (cr === -1) {
			while (lf !== -1) {
				res.push(lineStart);
				lineStart = lf + 1;
				lf = source.indexOf("\n", lineStart);
			}
			break;
		}
		if (cr + 1 === lf) {
			res.push(lineStart);
			lineStart = lf + 1;
			cr = source.indexOf("\r", lineStart);
			lf = source.indexOf("\n", lineStart);
			continue;
		}
		res.push(lineStart);
		if (cr < lf) {
			lineStart = cr + 1;
			cr = source.indexOf("\r", lineStart);
		} else {
			lineStart = lf + 1;
			lf = source.indexOf("\n", lineStart);
		}
	}
	res.push(lineStart);
	return res;
}

/**
 * Prefer passing a `source` of type `HasGetLineAndCharacterOfPosition` or `SourceFileWithLineMap`.
 * This way, the expensive computation of the `lineMap` will be cached across multiple calls.
 */
export function getPositionOfColumnAndLine(
	source: SourceFileWithLineMap | string,
	columnAndLine: ColumnAndLineWithoutRaw,
): number {
	if (typeof source === "string") {
		return computePositionOfColumnAndLine(
			source,
			computeLineStarts(source),
			columnAndLine,
		);
	}
	source.lineMap ??= computeLineStarts(source.text);
	return computePositionOfColumnAndLine(
		source.text,
		source.lineMap,
		columnAndLine,
	);
}

function computePositionOfColumnAndLine(
	sourceText: string,
	lineStarts: readonly number[],
	{ column, line }: ColumnAndLineWithoutRaw,
): number {
	line = Math.min(Math.max(line, 0), lineStarts.length - 1);

	// line is bounded by the Math.min check above
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const res = lineStarts[line]! + column;
	if (line === lineStarts.length - 1) {
		return Math.min(res, sourceText.length);
	}
	// line is bounded by the Math.min check above
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return Math.min(res, lineStarts[line + 1]! - 1);
}
