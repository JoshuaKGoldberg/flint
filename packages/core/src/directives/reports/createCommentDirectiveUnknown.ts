import { NormalizedReportRangeObject } from "../../types/reports.js";

export function createCommentDirectiveUnknown(
	type: string,
	range: NormalizedReportRangeObject,
) {
	return {
		about: {
			id: "commentDirectiveUnknown",
		},
		message: {
			primary: `Unknown comment directive type: "${type}".`,
			secondary: ["TODO"],
			suggestions: ["TODO"],
		},
		range,
	};
}
