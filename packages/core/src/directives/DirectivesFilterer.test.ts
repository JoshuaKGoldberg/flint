import { describe, expect, it } from "vitest";

import type { FileReport } from "../types/reports.ts";
import { DirectivesFilterer } from "./DirectivesFilterer.ts";

function createReport(forLine: number, id: string) {
	return {
		about: { id },
		message: {
			primary: "",
			secondary: [],
			suggestions: [],
		},
		range: {
			begin: {
				column: 0,
				line: forLine,
				raw: 0,
			},
			end: {
				column: 1,
				line: forLine,
				raw: 1,
			},
		},
	} satisfies FileReport;
}

describe(DirectivesFilterer, () => {
	describe("filter", () => {
		it("returns all reports when no directives have been added", () => {
			const filterer = new DirectivesFilterer();
			const reports = [createReport(0, "example")];

			const actual = filterer.filter(reports);

			expect(actual.reports).toEqual(reports);
			expect(actual.unusedDirectives.fileDirectives).toEqual([]);
			expect(actual.unusedDirectives.rangeDirectives).toEqual([]);
		});

		it("returns all reports when no directives apply to them", () => {
			const filterer = new DirectivesFilterer();

			const directive = {
				range: {
					begin: {
						column: 0,
						line: 0,
						raw: 0,
					},
					end: {
						column: 0,
						line: 0,
						raw: 0,
					},
				},
				selections: ["*other*"],
				type: "disable-next-line" as const,
			};

			filterer.add([directive]);

			const reports = [createReport(0, "example"), createReport(1, "example")];

			const actual = filterer.filter(reports);

			expect(actual.reports).toEqual(reports);
			expect(actual.unusedDirectives.rangeDirectives).toHaveLength(1);
			expect(actual.unusedDirectives.rangeDirectives[0].selections).toEqual([
				"*other*",
			]);
		});

		it("returns unfiltered reports when a directive filters one report", () => {
			const filterer = new DirectivesFilterer();

			filterer.add([
				{
					range: {
						begin: {
							column: 0,
							line: 0,
							raw: 0,
						},
						end: {
							column: 0,
							line: 0,
							raw: 0,
						},
					},
					selections: ["example"],
					type: "disable-next-line",
				},
			]);

			const reports = [createReport(0, "example"), createReport(1, "example")];

			const actual = filterer.filter(reports);

			expect(actual.reports).toEqual([reports[0]]);
			expect(actual.unusedDirectives.rangeDirectives).toEqual([]);
		});
	});
});
