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

			expect(actual).toEqual({
				reports,
				unusedDirectives: [],
			});
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

			expect(actual).toEqual({
				reports,
				unusedDirectives: [directive],
			});
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

			expect(actual).toEqual({
				reports: [reports[0]],
				unusedDirectives: [],
			});
		});

		it("identifies unused file directives that don't match any reports", () => {
			const filterer = new DirectivesFilterer();

			const unusedDirective = {
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
				type: "disable-file" as const,
			};

			filterer.add([unusedDirective]);

			const reports = [createReport(0, "example"), createReport(1, "example")];

			const actual = filterer.filter(reports);

			expect(actual).toEqual({
				reports,
				unusedDirectives: [unusedDirective],
			});
		});

		it("does not include used file directives in unusedDirectives", () => {
			const filterer = new DirectivesFilterer();

			const usedDirective = {
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
				type: "disable-file" as const,
			};

			filterer.add([usedDirective]);

			const reports = [createReport(0, "example"), createReport(1, "example")];

			const actual = filterer.filter(reports);

			expect(actual).toEqual({
				reports: [],
				unusedDirectives: [],
			});
		});

		it("identifies only unused file directives when some are used and some are not", () => {
			const filterer = new DirectivesFilterer();

			const usedDirective = {
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
				type: "disable-file" as const,
			};

			const unusedDirective1 = {
				range: {
					begin: {
						column: 0,
						line: 1,
						raw: 1,
					},
					end: {
						column: 0,
						line: 1,
						raw: 1,
					},
				},
				selections: ["*other*"],
				type: "disable-file" as const,
			};

			const unusedDirective2 = {
				range: {
					begin: {
						column: 0,
						line: 2,
						raw: 2,
					},
					end: {
						column: 0,
						line: 2,
						raw: 2,
					},
				},
				selections: ["*unused*"],
				type: "disable-file" as const,
			};

			filterer.add([usedDirective, unusedDirective1, unusedDirective2]);

			const reports = [createReport(0, "example"), createReport(1, "example")];

			const actual = filterer.filter(reports);

			expect(actual).toEqual({
				reports: [],
				unusedDirectives: [unusedDirective1, unusedDirective2],
			});
		});

		it("identifies unused file directives when directive has multiple selections and none match", () => {
			const filterer = new DirectivesFilterer();

			const unusedDirective = {
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
				selections: ["rule1", "rule2", "rule3"],
				type: "disable-file" as const,
			};

			filterer.add([unusedDirective]);

			const reports = [createReport(0, "example"), createReport(1, "other")];

			const actual = filterer.filter(reports);

			expect(actual).toEqual({
				reports,
				unusedDirectives: [unusedDirective],
			});
		});

		it("does not identify file directive as unused when at least one selection matches", () => {
			const filterer = new DirectivesFilterer();

			const usedDirective = {
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
				selections: ["rule1", "example", "rule3"],
				type: "disable-file" as const,
			};

			filterer.add([usedDirective]);

			const reports = [createReport(0, "example"), createReport(1, "other")];

			const actual = filterer.filter(reports);

			expect(actual).toEqual({
				reports: [reports[1]],
				unusedDirectives: [],
			});
		});
	});
});
