import { defineConfig } from "tsdown";

export default defineConfig({
	attw: {
		profile: "esm-only",
	},
	dts: true,
	entry: ["src/index.ts"],
	exports: {
		devExports: "@flint/source",
	},
	failOnWarn: true,
	fixedExtension: false,
	outDir: "lib",
	unbundle: true,
});
