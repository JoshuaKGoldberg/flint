import {
	CommentDirective,
	CommentDirectiveWithinFile,
} from "../types/directives.js";
import { FileReport } from "../types/reports.js";
import { computeDirectiveRanges } from "./computeDirectiveRanges.js";
import { createSelectionMatcher } from "./createSelectionMatcher.js";
import { isCommentDirectiveWithinFile } from "./predicates.js";
import { selectionMatchesDirectiveRanges } from "./selectionMatchesDirectiveRanges.js";
import { selectionMatchesReport } from "./selectionMatchesReport.js";

export class DirectivesFilterer {
	#directivesForRanges: CommentDirectiveWithinFile[] = [];
	#selectionsForFile = new Set<string>();

	add(directives: CommentDirective[]) {
		for (const directive of directives) {
			if (isCommentDirectiveWithinFile(directive)) {
				this.#directivesForRanges.push(directive);
			} else {
				for (const selection of directive.selections) {
					this.#selectionsForFile.add(selection);
				}
			}
		}
	}

	filter(reports: FileReport[]) {
		const directivesForFile = Array.from(this.#selectionsForFile).map(
			createSelectionMatcher,
		);

		const directiveRanges = computeDirectiveRanges(this.#directivesForRanges);

		return reports.filter(
			(report) =>
				!directivesForFile.some((fileDisable) =>
					selectionMatchesReport(fileDisable, report),
				) && !selectionMatchesDirectiveRanges(directiveRanges, report),
		);

		// TODO: Also keep track of which directives/selections did nothing

		// FAQ to document: if this is not doable because disabling * doesn't
		// do anything, either:
		// * it's code you control: so stop disabling
		// * it's code you don't control: so stop linting, or reconfigure
	}
}
