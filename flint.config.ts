import { cspell } from "@flint.fyi/plugin-cspell";
import { flint } from "@flint.fyi/plugin-flint";
import { defineConfig, json, md, ts, yml } from "flint";

export default defineConfig({
	use: [
		{
			glob: "**/*",
			rules: [cspell.presets.logical],
		},
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
			rules: [flint.presets.logical, ts.presets.logical],
		},
		{
			exclude: ["pnpm-lock.yaml"],
			glob: yml.globs.all,
			rules: [yml.presets.logical],
		},
	],
});
