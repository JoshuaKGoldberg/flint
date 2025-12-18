import { describe, expect, it, vi } from "vitest";

import { assertValues } from "./assertValues.js";

const mockAssertValue = vi.fn();

vi.mock("./assertValue.js", () => ({
	get assertValue() {
		return mockAssertValue;
	},
}));

describe(assertValues, () => {
	it("throws an error when actual is undefined and expected is defined", () => {
		const actual = undefined;
		const expected = [{ value: "a" }, { value: "b" }];

		expect(() => {
			assertValues(actual, expected);
		}).toThrow();
	});

	it("throws an error when actual is defined and expected is undefined", () => {
		const actual = [{ value: "a" }, { value: "b" }];
		const expected = undefined;

		expect(() => {
			assertValues(actual, expected);
		}).toThrow();
	});

	it("throws an error when actual is a different length than expected", () => {
		const actual = [{ value: "a" }, { value: "b" }];
		const expected = [{ value: "a" }];

		expect(() => {
			assertValues(actual, expected);
		}).toThrow();
	});

	it("calls assertValue on each item when actual and expected have the same length", () => {
		const actual = [{ value: "a" }, { value: "b" }];
		const expected = [{ value: "a" }, { value: "b" }];

		assertValues(actual, expected);

		expect(mockAssertValue.mock.calls).toEqual([
			[actual[0], expected[0]],
			[actual[1], expected[1]],
		]);
	});
});
