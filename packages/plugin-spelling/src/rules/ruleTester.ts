import type { TextNodes, TextServices } from "@flint.fyi/text";

import { RuleTester } from "@flint.fyi/rule-tester";
import { describe, it } from "vitest";

export const ruleTester = new RuleTester<TextNodes, TextServices>({
	describe,
	it,
});
