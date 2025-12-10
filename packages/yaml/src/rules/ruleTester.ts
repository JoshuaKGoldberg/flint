import { RuleTester } from "@flint.fyi/rule-tester";
import { describe, it } from "vitest";

import type { YamlServices } from "../language.js";
import type { YamlNodesByName } from "../nodes.js";

export const ruleTester = new RuleTester<YamlNodesByName, YamlServices>({
	defaults: { fileName: "file.yaml" },
	describe,
	it,
});
