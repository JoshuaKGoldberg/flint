import { defineConfig } from "tsdown";

export default defineConfig({
	attw: {
		profile: "esm-only",
	},
	clean: ["./node_modules/.cache/tsbuildinfo.json"],
	dts: { build: true, incremental: true },
	entry: [
		"src/index.ts",
		"src/ts-patch/install-patch-hooks.ts",
		"src/ts-patch/install-patch.ts",
		"src/ts-patch/proxy-program.ts",
	],
	failOnWarn: true,
	fixedExtension: false,
	outDir: "lib",
	unbundle: true,
});
