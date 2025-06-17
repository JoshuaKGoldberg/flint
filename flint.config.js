import { defineConfig, json, ts } from "./lib/index.js";

export default defineConfig({
	use: [
		{
			glob: json.globs.all,
			rules: [json.presets.logical],
		},
		{
			glob: ts.globs.all,
			rules: [ts.presets.logical],
		},
		// Catch-all globs until we have dedicated plugins...
		{
			glob: [
				// https://github.com/JoshuaKGoldberg/flint/issues/47
				"**/*.md",

				// https://github.com/JoshuaKGoldberg/flint/issues/48
				"**/*.yml",
			],
		},
	],
});
