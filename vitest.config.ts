import { readdirSync } from "node:fs";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		conditions: ["@flint.fyi/source"],
	},
	test: {
		projects: readdirSync("./packages").map((name) => ({
			test: {
				clearMocks: true,
				include: ["**/src/**/*.test.ts"],
				name,
				root: `./packages/${name}`,
				setupFiles: [
					"console-fail-test/setup",
					"@flint.fyi/ts-patch/install-patch-hooks",
				],
				testTimeout: 10_000,
				typecheck: {
					enabled: true,
				},
			},
		})),
	},
});
