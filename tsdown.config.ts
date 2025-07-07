import { defineConfig } from "tsdown";

export default defineConfig({
	dts: true,
	entry: ["src/**/*.ts", "!src/**/*.test.*", "!src/fixtures/*"],
	outDir: "lib",
	unbundle: true,
});
