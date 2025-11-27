import { describe, expect, it } from "vitest";

import { flatten } from "./arrays.js";

describe("flatten", () => {
	it("works with plain arrays", () => {
		const array = [1];

		const result: number[] = flatten(array);

		expect(result).toEqual([1]);
	});

	it("works with super nested arrays", () => {
		const array = [[[[[[[[[[[[[[[[[[[[[[[[1]]]]]]]]]]]]]]]]]]]]]]]];

		const result: number[] = flatten(array);

		expect(result).toEqual([1]);
	});
});
