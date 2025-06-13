import { describe, it, vi } from "vitest";
import z from "zod";

import { typescript } from "../typescript/language.js";
import { createPlugin } from "./createPlugin.js";

const stubMessages = { "": { primary: "", secondary: [], suggestions: [] } };

const ruleStandalone = typescript.createRule({
	about: {
		id: "standalone",
	},
	messages: stubMessages,
	setup: vi.fn(),
});

const ruleWithOptionalOption = typescript.createRule({
	about: {
		id: "withOptionalOption",
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
