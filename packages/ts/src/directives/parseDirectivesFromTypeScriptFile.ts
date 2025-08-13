import { DirectivesCollector } from "@flint.fyi/core";
import * as tsutils from "ts-api-utils";
import ts from "typescript";

import { normalizeRange } from "../normalizeRange.js";

export function parseDirectivesFromTypeScriptFile(sourceFile: ts.SourceFile) {
	const collector = new DirectivesCollector(
		sourceFile.statements.at(0)?.getStart(sourceFile) ?? sourceFile.text.length,
	);

	tsutils.forEachComment(sourceFile, (fullText, sourceRange) => {
		const commentText = fullText.slice(sourceRange.pos, sourceRange.end);
		const match = /^\/\/\s*flint-(\S+)(?:\s+(.+))?/.exec(commentText);
		if (!match) {
			return;
		}

		const commentRange = {
			begin: sourceRange.pos,
			end: sourceRange.end,
		};

		const range = normalizeRange(commentRange, sourceFile);
		const [type, selection] = match.slice(1);

		collector.add(range, selection, type);
	});

	return collector.collect();
}
