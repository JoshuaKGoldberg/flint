import { CommentDirectiveWithinFile } from "../types/directives.js";
import { createSelectionMatcher } from "./createSelectionMatcher.js";

export interface RangedSelection {
	lines: RangedSelectionLines;

	// TODO: There's got to be a better way.
	// Maybe an existing common one like minimatch?
	selections: RegExp[];
}

export interface RangedSelectionLines {
	begin: number;
	end: number;
}

export function computeDirectiveRanges(
	directives: CommentDirectiveWithinFile[],
) {
	if (directives.length === 0) {
		return [];
	}

	if (directives.length === 1) {
		const [directive] = directives;
		switch (directive.type) {
			case "disable-lines-begin":
				return [
					{
						lines: {
							begin: directive.range.begin.line + 1,
							end: Infinity,
						},
						selections: directive.selections.map(createSelectionMatcher),
					},
				];

			case "disable-next-line":
				return [
					{
						lines: {
							begin: directive.range.begin.line + 1,
							end: directive.range.end.line + 1,
						},
						selections: directive.selections.map(createSelectionMatcher),
					},
				];
		}
	}

	const directivesSorted = directives.sort(
		(a, b) => a.range.begin.raw - b.range.begin.raw,
	);

	const rangedSelections: RangedSelection[] = [];
	let previousDirective = directivesSorted[0];
	let currentSelections = directivesSorted[0].selections;

	for (const directive of directivesSorted.slice(1)) {
		rangedSelections.push({
			lines: {
				begin:
					previousDirective.range.begin.line +
					(previousDirective.type === "disable-next-line" ? 2 : 1),
				end: directive.range.begin.line,
			},
			selections: currentSelections.map(createSelectionMatcher),
		});

		switch (directive.type) {
			case "disable-lines-begin":
				currentSelections = joinSelections(
					currentSelections,
					directive.selections,
				);
				break;
			case "disable-lines-end":
				currentSelections = removeSelections(
					currentSelections,
					directive.selections,
				);
				break;
			case "disable-next-line":
				rangedSelections.push({
					lines: {
						begin: directive.range.begin.line + 1,
						end: directive.range.end.line + 1,
					},
					selections: joinSelections(
						currentSelections,
						directive.selections,
					).map(createSelectionMatcher),
				});
				break;
		}

		previousDirective = directive;
	}

	if (currentSelections.length) {
		rangedSelections.push({
			lines: {
				begin:
					previousDirective.range.begin.line +
					(previousDirective.type === "disable-next-line" ? 2 : 1),
				end: Infinity,
			},
			selections: currentSelections.map(createSelectionMatcher),
		});
	}

	return rangedSelections;
}

function joinSelections(
	currentSelections: string[],
	selections: string[],
): string[] {
	return Array.from(new Set([...currentSelections, ...selections]));
}

function removeSelections(
	currentSelections: string[],
	selections: string[],
): string[] {
	return currentSelections.filter(
		(selection) => !selections.includes(selection),
	);
}
