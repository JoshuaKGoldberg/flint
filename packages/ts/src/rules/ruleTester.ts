import { RuleTester } from "@flint.fyi/rule-tester";
import { describe, it } from "vitest";

import type { TypeScriptServices } from "../language.js";
import type { TSNodesByName } from "../nodes.js";

export const ruleTester = new RuleTester<TSNodesByName, TypeScriptServices>({
	defaults: { fileName: "file.ts" },
	describe,
	it,
});
