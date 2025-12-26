import { defineConfig } from "tsdown";

export default defineConfig({
	dts: true,
	entry: [
		"src/index.ts",
		"src/ts-patch/install-patch-hooks.ts",
		"src/ts-patch/install-patch.ts",
		"src/ts-patch/proxy-program.ts",
	],
	exports: {
		devExports: "@flint/source",
	},
	fixedExtension: false,
	outDir: "lib",
	unbundle: true,
});
