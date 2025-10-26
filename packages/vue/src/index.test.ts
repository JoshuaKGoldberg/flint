import { describe, expect, it } from "vitest";
import { translateRange } from "./index.js";
import { SourceMap } from "@volar/source-map";

describe("translateRange", () => {
	const prefix = '<MyComponent :bar="';
	const beforeVariable = "() => ";
	const variable = "foo";
	const suffix = '"/>';
	const source = prefix + beforeVariable + variable + suffix;

	const generatedPrefix = "generated_bar: (";
	const generatedBeforeVariable = "__VLS_ctx.";
	const generatedSuffix = ")";
	const generated =
		generatedPrefix +
		beforeVariable +
		generatedBeforeVariable +
		variable +
		generatedSuffix;

	const mapping = new SourceMap([
		{
			sourceOffsets: [prefix.length],
			generatedOffsets: [generatedPrefix.length],
			lengths: [beforeVariable.length],
			data: {},
		},
		{
			sourceOffsets: [(prefix + beforeVariable).length],
			generatedOffsets: [
				(generatedPrefix + beforeVariable + generatedBeforeVariable).length,
			],
			lengths: [variable.length],
			data: {},
		},
	]);

	it(`
generated_bar: (() => __VLS_ctx.foo)
                      ^^^^^^^^^^^^^
<MyComponent :bar="() => foo"/>
                         ^^^
`, () => {
		const range = translateRange(
			generated,
			mapping,
			(generatedPrefix + beforeVariable).length,
			(generatedPrefix + beforeVariable + generatedBeforeVariable + variable)
				.length,
		);

		expect(range).toStrictEqual({
			begin: (prefix + beforeVariable).length,
			end: (prefix + beforeVariable + variable).length,
		});
	});

	it(`
generated_bar: (() => __VLS_ctx.foo)
                    ^^^^^^^^^^^^^^^
<MyComponent :bar="() => foo"/>
                       ^^^^^
`, () => {
		const range = translateRange(
			generated,
			mapping,
			(generatedPrefix + beforeVariable).length - 2,
			(generatedPrefix + beforeVariable + generatedBeforeVariable + variable)
				.length,
		);

		expect(range).toStrictEqual({
			begin: (prefix + beforeVariable).length - 2,
			end: (prefix + beforeVariable + variable).length,
		});
	});

	it(`
generated_bar: (() => __VLS_ctx.foo)
                      ^^^^^^^^^^^^^^
<MyComponent :bar="() => foo"/>

`, () => {
		const range = translateRange(
			generated,
			mapping,
			(generatedPrefix + beforeVariable).length,
			(generatedPrefix + beforeVariable + generatedBeforeVariable + variable)
				.length + 1,
		);

		expect(range).toBeNull();
	});

	it(`
generated_bar: (() => __VLS_ctx.foo)
                ^^^^^^^^^^^^^^^^^^^
<MyComponent :bar="() => foo"/>
                   ^^^^^^^^^
`, () => {
		const range = translateRange(
			generated,
			mapping,
			generatedPrefix.length,
			(generatedPrefix + beforeVariable + generatedBeforeVariable + variable)
				.length,
		);

		expect(range).toStrictEqual({
			begin: prefix.length,
			end: (prefix + beforeVariable + variable).length,
		});
	});
});
