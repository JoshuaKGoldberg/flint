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
	unusedDirectives: CommentDirective[];
}

export class DirectivesFilterer {
	#directivesForFile: CommentDirective[] = [];
	#directivesForRanges: CommentDirectiveWithinFile[] = [];

	add(directives: CommentDirective[]) {
		for (const directive of directives) {
			if (isCommentDirectiveWithinFile(directive)) {
				this.#directivesForRanges.push(directive);
			} else {
				this.#directivesForFile.push(directive);
			}
		}
	}

	filter(reports: FileReport[]): FilterResult {
		const selectionsForFile = this.#directivesForFile.flatMap((directive) =>
			directive.selections.map((selection) => ({
				directive,
				matcher: createSelectionMatcher(selection),
				selection,
			})),
		);

		const directiveRanges = computeDirectiveRanges(this.#directivesForRanges);

		const matchedDirectives = new Set<CommentDirective>();

		const filteredReports = reports.filter((report) => {
			const fileMatched = selectionsForFile.some(({ directive, matcher }) => {
				const matches = selectionMatchesReport(matcher, report);
				if (matches) {
					matchedFileDirectives.add(directive);
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
						selectionMatchesDirectiveRanges(directiveRange, report)
					) {
						matchedRangeDirectives.add(directive);
					}
				}
			}

			return !fileMatched && !rangeMatched;
		});

		const unusedDirectives = [
			...this.#directivesForFile,
			...this.#directivesForRanges,
		].filter((directive) => !matchedDirectives.has(directive));

		return {
			reports: filteredReports,
			unusedDirectives: [...unusedFileDirectives, ...unusedRangeDirectives],
		};
	}
}
