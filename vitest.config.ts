import { defaultExclude, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		clearMocks: true,
		coverage: {
			all: true,
			exclude: [...defaultExclude, "src/index.ts", "**/*.test-d.ts"],
			include: ["src"],
			reporter: ["html", "lcov"],
		},
		exclude: ["lib", "node_modules"],
		setupFiles: ["console-fail-test/setup"],
		testTimeout: 10_000,
	},
});
