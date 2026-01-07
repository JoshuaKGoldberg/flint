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

		const matchedFileSelections = new Set<string>();
		const matchedRangeDirectives = new Set<CommentDirectiveWithinFile>();

		const filteredReports = reports.filter((report) => {
			const fileMatched = directivesForFile.some((fileDisable, index) => {
				const matches = selectionMatchesReport(fileDisable, report);
				if (matches) {
					const selection = Array.from(this.#selectionsForFile)[index];
					matchedFileSelections.add(selection);
				}
				return matches;
			});

			const rangeMatched = selectionMatchesDirectiveRanges(
				directiveRanges,
				report,
			);

			// This tracks which directives actually suppressed reports
			if (rangeMatched) {
				for (const directive of this.#directivesForRanges) {
					const directiveRange = computeDirectiveRanges([directive]);
					if (
						selectionMatchesDirectiveRanges(directiveRange, report) &&
						!matchedRangeDirectives.has(directive)
					) {
						matchedRangeDirectives.add(directive);
					}
				}
			}

			return !fileMatched && !rangeMatched;
		});

		const unusedFileDirectives = this.#directivesForFile.filter((directive) =>
			directive.selections.every(
				(selection) => !matchedFileSelections.has(selection),
			),
		);

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
