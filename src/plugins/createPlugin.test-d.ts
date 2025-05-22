import { describe, it, vi } from "vitest";
import z from "zod";

import { createRule } from "../createRule.js";
import { createPlugin } from "./createPlugin.js";

const ruleStandalone = createRule({
	about: {
		id: "standalone",
	},
	messages: { "": "" },
	setup: vi.fn(),
});

const ruleWithOptionalOption = createRule({
	about: {
		id: "withOptionalOption",
	},
	messages: { "": "" },
	options: {
		value: z.string().optional(),
	},
	setup: vi.fn(),
});

describe(createPlugin, () => {
	const plugin = createPlugin({
		name: "test",
		rules: [ruleStandalone, ruleWithOptionalOption],
	});

	describe("rules", () => {
		it("produces a type error when a rule option is the wrong type", () => {
			plugin.rules({
				withOptionalOption: {
					// @ts-expect-error -- This should report that a string is required
					value: 123,
				},
			});
		});
	});
});
