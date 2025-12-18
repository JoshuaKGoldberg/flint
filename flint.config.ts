// import { flint } from "@flint.fyi/plugin-flint";
import { node } from "@flint.fyi/plugin-node";
import { spelling } from "@flint.fyi/plugin-spelling";
import { defineConfig, globs, json, md, ts, yaml } from "flint";

export default defineConfig({
	use: [
		{
			files: json.files.all,
			rules: json.presets.logical,
		},
		{
			files: md.files.all,
			rules: md.presets.stylistic,
		},
		{
			files: {
				exclude: process.env.LINT_FIXTURES ? [] : ["packages/fixtures"],
				include: ts.files.all,
			},
			rules: [
				// flint.presets.logical,
				// node.presets.logical,
				// node.presets.stylistic,
				// ts.presets.logical,
				// ts.presets.stylistic,
				ts.rules({
					anyReturns: undefined,
				}),
			],
		},
		{
			files: {
				exclude: ["pnpm-lock.yaml"],
				include: yaml.files.all,
			},
			rules: yaml.presets.logical,
		},
		{
			files: globs.all,
			rules: spelling.presets.logical,
		},
	],
});
