import { describe, expect, it } from "vitest";
import { normalizePath } from "./normalizePath.js";

describe("normalizePath", () => {
	it("normalizes Windows path", () => {
		const normalized = normalizePath("C:\\my-PATH\\foo\\", false);

		expect(normalized).toEqual("c:/my-path/foo");
	});

	it("normalizes POSIX path", () => {
		const normalized = normalizePath("/my-PATH/foo/", true);

		expect(normalized).toEqual("/my-PATH/foo");
	});

	it("strips unnecessary path segments", () => {
		const normalized = normalizePath("/foo//bar/../baz/.//", true);

		expect(normalized).toEqual("/foo/baz");
	});
});
