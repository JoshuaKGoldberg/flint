import { defineConfig } from "tsdown";

export default defineConfig({
	attw: {
		profile: "esm-only",
	},
	dts: { build: true },
	entry: ["src/index.ts"],
	failOnWarn: true,
	fixedExtension: false,
	outDir: "lib",
	unbundle: true,
});
