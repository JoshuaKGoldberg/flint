import { RuleTester } from "@flint.fyi/rule-tester";
import { describe, it } from "vitest";

import type { MarkdownServices } from "../language.js";
import type { MarkdownNodesByName } from "../nodes.js";

export const ruleTester = new RuleTester<MarkdownNodesByName, MarkdownServices>(
	{
		describe,
		it,
	},
);
