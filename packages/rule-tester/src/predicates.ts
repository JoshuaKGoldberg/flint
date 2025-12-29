import type { TestSuggestion, TestSuggestionForFiles } from "./types.js";

export function isTestSuggestionForFiles(
	suggestion: TestSuggestion,
): suggestion is TestSuggestionForFiles {
	return "files" in suggestion;
}
