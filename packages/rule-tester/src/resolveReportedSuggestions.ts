import {
	applyChangesToText,
	isSuggestionForFiles,
	NormalizedReport,
} from "@flint.fyi/core";
import { SuggestionForFiles } from "@flint.fyi/core/src/types/changes.js";
import { isTruthy } from "@flint.fyi/utils";

import { TestCaseNormalized } from "./normalizeTestCase.js";
import { InvalidTestCase, TestSuggestionFileCase } from "./types.js";

export function resolveReportedSuggestions(
	reports: NormalizedReport[],
	testCaseNormalized: InvalidTestCase & TestCaseNormalized,
) {
	const suggestionsReported = reports
		.flatMap((report) => report.suggestions)
		.filter(isTruthy);

	if (!suggestionsReported.length) {
		return undefined;
	}

	return suggestionsReported.map((suggestionReported) => ({
		files: isSuggestionForFiles(suggestionReported)
			? resolveReportedSuggestionForFiles(
					suggestionReported,
					testCaseNormalized,
				)
			: [
					{
						[testCaseNormalized.fileName]: suggestionReported,
					},
				],
		id: suggestionReported.id,
	}));
}

function resolveReportedSuggestionForFiles(
	suggestionReported: SuggestionForFiles,
	testCaseNormalized: InvalidTestCase & TestCaseNormalized,
) {
	if (!testCaseNormalized.suggestions) {
		return {};
	}

	return Object.fromEntries(
		testCaseNormalized.suggestions
			.map((suggestionExpected): [string, TestSuggestionFileCase[]][] => {
				return Object.entries(suggestionExpected.files).map(
					([filePath, suggestionCasesExpected]) => {
						return [
							filePath,
							suggestionCasesExpected.map((suggestionCaseExpected) => {
								const changes = suggestionReported.files[filePath]?.(
									suggestionCaseExpected.original,
								);
								return {
									original: suggestionCaseExpected.original,
									updated: changes
										? applyChangesToText(
												changes,
												suggestionCaseExpected.original,
											)
										: suggestionCaseExpected.original,
								};
							}),
						];
					},
				);
			})
			.flat(),
	);
}
