import { describe, expect, it } from "vitest";

import { assert, FlintAssertionError, nullThrows } from "./assert.ts";

describe("assert", () => {
	it("throws on null", () => {
		expect(() => {
			assert(null, "MSG");
		}).toThrowError(new FlintAssertionError("MSG"));
	});

	it("throws on undefined", () => {
		expect(() => {
			assert(undefined, "MSG");
		}).toThrowError(new FlintAssertionError("MSG"));
	});

	it("throws on false", () => {
		expect(() => {
			assert(false, "MSG");
		}).toThrowError(new FlintAssertionError("MSG"));
	});

	it("doesn't throw on true", () => {
		expect(() => {
			assert(true, "MSG");
		}).not.toThrowError();
	});

	it("doesn't throw on obj", () => {
		expect(() => {
			assert({}, "MSG");
		}).not.toThrowError();
	});
});

describe("nullThrows", () => {
	it("throws on null", () => {
		expect(() => nullThrows(null, "MSG")).toThrowError(
			new FlintAssertionError("MSG"),
		);
	});

	it("throws on undefined", () => {
		expect(() => nullThrows(undefined, "MSG")).toThrowError(
			new FlintAssertionError("MSG"),
		);
	});

	it("doesn't throw on false", () => {
		expect(() => nullThrows(false, "MSG")).not.toThrowError();
	});

	it("doesn't throw on obj", () => {
		expect(() => nullThrows({}, "MSG")).not.toThrowError();
	});
});
