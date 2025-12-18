import assert from "node:assert/strict";

import { StringExpectation } from "../types.js";
import { assertString } from "./assertString.js";

export function assertValue<Value extends object>(
	actual: Value,
	expected: Value,
) {
	for (const [key, actualValue] of Object.entries(actual)) {
		const expectedValue = expected[key as keyof Value] as StringExpectation;

		if (typeof actualValue === "string") {
			assertString(actualValue, expectedValue);
		} else {
			assert.deepStrictEqual(actualValue, expectedValue);
		}
	}
}
