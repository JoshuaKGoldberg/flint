import assert from "node:assert/strict";

import { StringExpectation } from "../types.js";

export function assertString(actual: string, expected: StringExpectation) {
	if (typeof expected === "function") {
		expected(actual);
	} else {
		assert.strictEqual(actual, expected);
	}
}
