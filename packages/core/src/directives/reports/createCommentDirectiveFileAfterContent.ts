import { NormalizedReportRangeObject } from "../../types/reports.js";

export function createCommentDirectiveFileAfterContent(
	range: NormalizedReportRangeObject,
) {
	return {
		about: {
			id: "commentDirectiveFileAfterContent",
		},
		message: {
			primary: `A "flint-disable-file" comment directive must come before any non-comment contents.`,
			secondary: ["TODO"],
			suggestions: ["TODO"],
		},
		range,
	};
}
