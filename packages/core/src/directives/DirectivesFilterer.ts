import type {
	CommentDirective,
	CommentDirectiveWithinFile,
} from "../types/directives.ts";
import type { FileReport } from "../types/reports.ts";
import { computeDirectiveRanges } from "./computeDirectiveRanges.ts";
import { createSelectionMatcher } from "./createSelectionMatcher.ts";
import { isCommentDirectiveWithinFile } from "./predicates.ts";
import { selectionMatchesDirectiveRanges } from "./selectionMatchesDirectiveRanges.ts";
import { selectionMatchesReport } from "./selectionMatchesReport.ts";

export interface FilterResult {
	reports: FileReport[];
	unusedDirectives: {
		fileDirectives: CommentDirective[];
		rangeDirectives: CommentDirectiveWithinFile[];
	};
}

export class DirectivesFilterer {
	#directivesForFile: CommentDirective[] = [];
	#directivesForRanges: CommentDirectiveWithinFile[] = [];
	#selectionsForFile = new Set<string>();

	add(directives: CommentDirective[]) {
		for (const directive of directives) {
			if (isCommentDirectiveWithinFile(directive)) {
				this.#directivesForRanges.push(directive);
			} else {
				this.#directivesForFile.push(directive);
				for (const selection of directive.selections) {
					this.#selectionsForFile.add(selection);
				}
			}
		}
	}

	filter(reports: FileReport[]): FilterResult {
		const directivesForFile = Array.from(this.#selectionsForFile).map(
			createSelectionMatcher,
		);

		const directiveRanges = computeDirectiveRanges(this.#directivesForRanges);

		// Track which file-level selections matched at least one report
		const matchedFileSelections = new Set<string>();
		// Track which range-level directives matched at least one report
		const matchedRangeDirectives = new Set<CommentDirectiveWithinFile>();

		const filteredReports = reports.filter((report) => {
			// Check if any file-level directive matches
			const fileMatched = directivesForFile.some((fileDisable, index) => {
				const matches = selectionMatchesReport(fileDisable, report);
				if (matches) {
					const selection = Array.from(this.#selectionsForFile)[index];
					matchedFileSelections.add(selection);
				}
				return matches;
			});

			// Check if any range-level directive matches
			const rangeMatched = selectionMatchesDirectiveRanges(
				directiveRanges,
				report,
			);

			// Find which directive(s) would match this report
			// Check each directive individually to see if it would match
			// We do this for all reports, not just when rangeMatched is true,
			// to correctly track which directives matched
			for (const directive of this.#directivesForRanges) {
				const directiveRange = computeDirectiveRanges([directive]);
				if (
					selectionMatchesDirectiveRanges(directiveRange, report) &&
					!matchedRangeDirectives.has(directive)
				) {
					matchedRangeDirectives.add(directive);
				}
			}

			return !fileMatched && !rangeMatched;
		});

		// Find unused file-level directives (directives where none of their selections matched)
		const unusedFileDirectives = this.#directivesForFile.filter((directive) =>
			directive.selections.every(
				(selection) => !matchedFileSelections.has(selection),
			),
		);

		// Find unused range-level directives
		const unusedRangeDirectives = this.#directivesForRanges.filter(
			(directive) => !matchedRangeDirectives.has(directive),
		);

		return {
			reports: filteredReports,
			unusedDirectives: {
				fileDirectives: unusedFileDirectives,
				rangeDirectives: unusedRangeDirectives,
			},
		};
	}
}

function someUselessFunctionToTestDirectives() {
	const array = ["a", "b", "c"];
	// flint-disable-next-line forInArrays
	for (const i in array) {
		console.log(array[i]);
	}
	// flint-disable-next-line blahblahblah
	return null;
}

// flint-disable-next-line forInArrays
