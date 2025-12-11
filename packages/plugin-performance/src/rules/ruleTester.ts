import type { TSNodesByName, TypeScriptServices } from "@flint.fyi/ts";

import { RuleTester } from "@flint.fyi/rule-tester";
import { describe, it } from "vitest";

export const ruleTester = new RuleTester<TSNodesByName, TypeScriptServices>({
	defaults: { fileName: "file.ts" },
	describe,
	it,
});
