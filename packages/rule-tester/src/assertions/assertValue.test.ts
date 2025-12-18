import { describe, expect, it, vi } from "vitest";

import { assertValue } from "./assertValue.js";

const mockAssertString = vi.fn();

vi.mock("./assertString.js", () => ({
	get assertString() {
		return mockAssertString;
	},
}));

describe(assertValue, () => {
	it("calls assertString when a value is a string", () => {
		const actual = { value: "a" };
		const expected = { value: "b" };

		assertValue(actual, expected);

		expect(mockAssertString.mock.calls).toEqual([["a", "b"]]);
	});

	it("throws an error when a non-string property mismatches", () => {
		const actual = { value: 1 };
		const expected = { value: 2 };

		expect(() => {
			assertValue(actual, expected);
		}).toThrow();
	});
});
