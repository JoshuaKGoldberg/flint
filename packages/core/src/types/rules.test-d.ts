import { describe, expectTypeOf, it } from "vitest";
import { z } from "zod";

import { AnyRule, AnyRuleDefinition, Rule } from "./rules.js";
import { AnyOptionalSchema, InferredObject } from "./shapes.js";

describe("Rule", () => {
	it("should be assignable to AnyRule", () => {
		const rule = {} as Rule<
			{
				description: "desc";
				id: "id";
			},
			{ foo: "foo" },
			{ bar: "bar" },
			{ baz: "baz" },
			"message",
			undefined
		>;

		const fn = (r: AnyRule) => r;

		fn(rule);
	});

	it("should be assignable to AnyRuleDefinition", () => {
		const rule = {} as Rule<
			{
				description: "desc";
				id: "id";
			},
			{ foo: "foo" },
			{ bar: "bar" },
			{ baz: "baz" },
			"message",
			undefined
		>;

		const fn = (r: AnyRuleDefinition) => r;

		fn(rule);
	});

	it("should propagate options schema in setup", () => {
		type rule = Rule<
			{
				description: "desc";
				id: "id";
			},
			{ foo: "foo" },
			{ bar: "bar" },
			{ baz: "baz" },
			"message",
			{
				foo: z.ZodOptional<z.ZodString>;
			}
		>;

		const options = {} as Parameters<rule["setup"]>[0];

		expectTypeOf(options).toEqualTypeOf<{ foo?: string | undefined }>();
	});

	it("should work with AnyOptionalSchema|undefined", () => {
		// flint-disable-lines-begin voidOperator
		void (<T extends AnyOptionalSchema | undefined>(
			rule: AnyRuleDefinition<T>,
			options: InferredObject<T>,
		) => {
			void rule.setup(options);
		});
		// flint-disable-lines-end voidOperator
	});
});
