import { defineConfig } from "tsdown";

export default defineConfig({
	dts: true,
	entry: ["src/index.ts"],
	exports: {
		devExports: "@flint/source",
	},
	fixedExtension: false,
	outDir: "lib",
	unbundle: true,
});
