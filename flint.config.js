import { defineConfig, ts } from "./lib/index.js";

export default defineConfig({
	use: [
		{
			glob: ts.globs.all,
			rules: [
				ts.presets.logical,
				ts.rules({
					// (just to test out the CLI)
					forInArrays: false,
				}),
			],
		},
	],
});
