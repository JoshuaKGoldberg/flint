import { describe, expect, it, vi } from "vitest";

import { assertString } from "./assertString.js";

describe(assertString, () => {
	it("calls expected when the expected is a function", () => {
		const actual = "actual";
		const expected = vi.fn();

		assertString(actual, expected);

		expect(expected).toHaveBeenCalledWith(actual);
	});

	it("throws an error when expected is a different string than actual", () => {
		const actual = "test";
		const expected = "expected";

		expect(() => {
			assertString(actual, expected);
		}).toThrow();
	});

	it("does not throw an error when expected is the same string as actual", () => {
		const actual = "test";
		const expected = actual;

		expect(() => {
			assertString(actual, expected);
		}).not.toThrow();
	});
});
