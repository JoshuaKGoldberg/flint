import { createRuleTesterTSHost, RuleTester } from "@flint.fyi/rule-tester";
import { describe, it } from "vitest";

export const ruleTester = new RuleTester({
	describe,
	it,
	defaults: {
		fileName: "file.astro",
	},
	host: createRuleTesterTSHost(import.meta.dirname),
});
