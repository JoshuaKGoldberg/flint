import path from "node:path";

import { RuleTester } from "@flint.fyi/rule-tester";
import { describe, it } from "vitest";

const fileName = path.join(import.meta.dirname, "file.astro");

export const ruleTester = new RuleTester({
	describe,
	it,
	defaults: {
		fileName,
	},
});
