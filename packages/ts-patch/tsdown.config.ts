import { defineConfig } from "tsdown";

export default defineConfig({
	attw: {
		profile: "esm-only",
	},
	clean: ["./node_modules/.cache/tsbuildinfo.json"],
	dts: { build: true, incremental: true },
	entry: [
		"src/index.ts",
		"src/install-patch.ts",
		"src/install-patch-hooks.ts",
		"src/proxy-program.ts",
	],
	failOnWarn: true,
	fixedExtension: false,
	outDir: "lib",
	treeshake: false,
	unbundle: true,
});
