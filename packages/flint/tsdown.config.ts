import { defineConfig } from "tsdown";

export default defineConfig({
	attw: {
		profile: "esm-only",
	},
	clean: ["./node_modules/.cache/tsbuild/"],
	dts: { build: true, incremental: true },
	entry: ["src/index.ts"],
	failOnWarn: true,
	fixedExtension: false,
	outDir: "lib",
	unbundle: true,
});
