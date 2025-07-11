import { readdirSync } from "node:fs";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			all: true,
			exclude: [
				...coverageConfigDefaults.exclude,
				"**/config.ts",
				"packages/*/src/index.ts",
			],
			include: ["packages/*/src/"],
		},
		projects: readdirSync("./packages").map((name) => ({
			test: {
				clearMocks: true,
				include: ["**/src/**/*.test.ts"],
				name,
				root: `./packages/${name}`,
				setupFiles: ["console-fail-test/setup"],
				testTimeout: 10_000,
			},
		})),
	},
});
