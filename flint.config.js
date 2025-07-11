import { defineConfig, json, md, ts, yml } from "./packages/flint/lib/index.js";
import { flint } from "./packages/plugin-flint/lib/index.js";

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
			exclude: process.env.LINT_FIXTURES ? [] : ["packages/fixtures"],
			glob: ts.globs.all,
			rules: [...ts.presets.logical, ...flint.presets.logical],
		},
		{
			exclude: ["pnpm-lock.yaml"],
			glob: yml.globs.all,
			rules: [yml.presets.logical],
		},
	],
});
