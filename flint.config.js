import { defineConfig, ts } from "./lib/index.js";

export default defineConfig({
	use: [
		{
			glob: ts.globs.all,
			rules: [ts.presets.logical],
		},
	],
});
