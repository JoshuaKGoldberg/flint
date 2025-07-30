import { cspell } from "@flint.fyi/plugin-cspell";
import { flint } from "@flint.fyi/plugin-flint";
import { defineConfig, globs, json, md, ts, yml } from "flint";

// TODO: How to get the globs types piped through?

export default defineConfig({
	use: [
		// {
		// 	files: json.files!.all,
		// 	rules: [json.presets.logical],
		// },
		// {
		// 	files: md.files!.all,
		// 	rules: [md.presets.logical],
		// },
		// {
		// 	files: {
		// 		exclude: process.env.LINT_FIXTURES ? [] : ["packages/fixtures"],
		// 		include: ts.files!.all,
		// 	},
		// 	rules: [flint.presets.logical, ts.presets.logical],
		// },
		// {
		// 	files: {
		// 		exclude: ["pnpm-lock.yaml"],
		// 		include: yml.files!.all,
		// 	},
		// 	rules: [yml.presets.logical],
		// },
		{
			// files: globs.all,
			files: ["packages/plugin-cspell/src/rules/spelling.ts"],
			rules: [cspell.presets.logical],
		},
	],
});
