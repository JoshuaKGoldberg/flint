import { describe, expect, it, vi } from "vitest";
import z from "zod";

import { createLanguage } from "../languages/createLanguage.js";
import { createPlugin } from "./createPlugin.js";

const stubLanguage = createLanguage({
	about: { name: "Stub" },
	prepare: vi.fn(),
});

const stubMessages = { "": { primary: "", secondary: [], suggestions: [] } };

const ruleStandalone = stubLanguage.createRule({
	about: {
		id: "standalone",
		preset: "first",
	},
	messages: stubMessages,
	setup: vi.fn(),
});

const ruleWithOptionalOption = stubLanguage.createRule({
	about: {
		id: "withOptionalOption",
		preset: "second",
	},
	messages: stubMessages,
	options: {
		value: z.string().optional(),
	},
	setup: vi.fn(),
});

describe(createPlugin, () => {
	const plugin = createPlugin({
		globs: {},
		name: "test",
		rules: [ruleStandalone, ruleWithOptionalOption],
	});

	describe("presets", () => {
		it("groups rules by about.preset when it exists", () => {
			expect(plugin.presets).toEqual({
				first: [ruleStandalone],
				second: [ruleWithOptionalOption],
			});
		});
	});

	describe("rules", () => {
		it("returns a rule with options when specified with an option", () => {
			const value = "abc";
			const rules = plugin.rules({
				withOptionalOption: { value },
			});

			expect(rules).toEqual([
				{
					options: { value },
					rule: ruleWithOptionalOption,
				},
			]);
		});
	});
});
