import { CommentDirective } from "../types/directives.js";
import { FileReport, NormalizedReportRangeObject } from "../types/reports.js";
import { isCommentDirectiveType } from "./predicates.js";
import { directiveReports } from "./reports/directiveReports.js";

export class DirectivesCollector {
	#directives: CommentDirective[] = [];
	#reports: FileReport[] = [];
	#selectionsForFile = new Set<string>();
	#selectionsForRanges = new Set<string>();

	#statementsStartIndex: number;

	constructor(firstStatementIndex: number) {
		this.#statementsStartIndex = firstStatementIndex;
	}

	add(range: NormalizedReportRangeObject, selection: string, type: string) {
		if (!isCommentDirectiveType(type)) {
			this.#reports.push(directiveReports.createUnknown(type, range));
			return;
		}

		if (!selection) {
			this.#reports.push(directiveReports.createNoSelection(type, range));
			return;
		}

		const selections = selection.split(/\s+/).map((text) => text.trim());
		const directive: CommentDirective = { range, selections, type };

		this.#directives.push(directive);

		switch (type) {
			case "disable-file":
				this.#validateDisableFileDirective(directive);
				break;
			case "disable-lines-begin":
				this.#validateDisableLinesBeginDirective(directive);
				break;
			case "disable-lines-end":
				this.#validateDisableLinesEndDirective(directive);
				break;
			case "disable-next-line":
				this.#validateDisableNextLineDirective(directive);
				break;
		}
	}

	collect() {
		return {
			directives: this.#directives,
			reports: this.#reports,
		};
	}

	// TODO: These selection validators only check for this.#selections.has.
	// However, that doesn't match on asterisks/wildcard selectors.
	// Eventually they should more accurately check for wildcard overlaps.

	#validateDisableFileDirective(directive: CommentDirective) {
		if (directive.range.begin.raw > this.#statementsStartIndex) {
			this.#reports.push(
				directiveReports.createFileAfterContent(directive.range),
			);
			return;
		}

		for (const selection of directive.selections) {
			if (this.#selectionsForFile.has(selection)) {
				this.#reports.push(
					directiveReports.createAlreadyDisabled(directive, selection),
				);
			} else {
				this.#selectionsForFile.add(selection);
			}
		}
	}

	#validateDisableLinesBeginDirective(directive: CommentDirective) {
		for (const selection of directive.selections) {
			if (
				this.#selectionsForFile.has(selection) ||
				this.#selectionsForRanges.has(selection)
			) {
				this.#reports.push(
					directiveReports.createAlreadyDisabled(directive, selection),
				);
			} else {
				this.#selectionsForRanges.add(selection);
			}
		}
	}

	#validateDisableLinesEndDirective(directive: CommentDirective) {
		for (const selection of directive.selections) {
			if (this.#selectionsForRanges.has(selection)) {
				this.#selectionsForRanges.delete(selection);
			} else {
				this.#reports.push(
					directiveReports.createNotPreviouslyDisabled(
						directive.range,
						selection,
					),
				);
			}
		}
	}

	#validateDisableNextLineDirective(directive: CommentDirective) {
		for (const selection of directive.selections) {
			if (
				this.#selectionsForFile.has(selection) ||
				this.#selectionsForRanges.has(selection)
			) {
				this.#reports.push(
					directiveReports.createAlreadyDisabled(directive, selection),
				);
			}
		}
	}
}
