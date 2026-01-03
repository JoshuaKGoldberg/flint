import { createRuleTesterTSHost, RuleTester } from "@flint.fyi/rule-tester";
import { describe, it } from "vitest";

export const ruleTester = new RuleTester({
	defaults: { fileName: "file.ts" },
	describe,
	it,
	host: createRuleTesterTSHost(import.meta.dirname, {
		defaultCompilerOptions: {
			types: ["node"],
		},
	}),
});
