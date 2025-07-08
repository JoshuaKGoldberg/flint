import { defineConfig, json, md, ts, yaml } from "./lib/index.js";

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
			exclude: process.env.LINT_FIXTURES ? [] : ["src/fixtures"],
			glob: ts.globs.all,
			rules: [ts.presets.logical],
		},
		{
			exclude: ["pnpm-lock.yaml"],
			glob: yaml.globs.all,
			rules: [yaml.presets.logical],
		},
	],
});
