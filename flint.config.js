import { defineConfig, json, md, ts } from "./lib/index.js";

export default defineConfig({
	use: [
		{
			glob: json.globs.all,
			rules: [json.presets.logical],
		},
		{
			glob: md.globs.all,
			rules: [md.presets.logical],
		},
		{
			glob: ts.globs.all,
			rules: [ts.presets.logical],
		},
		// Catch-all globs until we have dedicated plugins...
		{
			glob: [
				// https://github.com/JoshuaKGoldberg/flint/issues/48
				"**/*.yml",
			],
		},
	],
});
