import assert from "node:assert/strict";

import { assertValue } from "./assertValue.js";

export function assertValues<Value extends object>(
	actual: undefined | Value[],
	expected: undefined | Value[],
) {
	assert.equal(actual?.length, expected?.length);

	if (!actual || !expected) {
		return;
	}

	for (let i = 0; i < actual.length; i += 1) {
		assertValue(actual[i], expected[i]);
	}
}
