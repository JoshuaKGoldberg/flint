import { RuleTester } from "@flint.fyi/rule-tester";
import { describe, it } from "vitest";

import type { JsonServices } from "../language.js";
import type { TSNodesByName } from "../nodes.js";

export const ruleTester = new RuleTester<TSNodesByName, JsonServices>({
	describe,
	it,
});
