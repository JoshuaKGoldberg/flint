import { readdirSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		conditions: ["@flint.fyi/source"],
	},
	test: {
		projects: readdirSync(path.join(import.meta.dirname, "packages")).map(
			(name) => ({
				test: {
					clearMocks: true,
					include: ["**/src/**/*.test.ts"],
					name,
					root: path.join(import.meta.dirname, "packages", name),
					setupFiles: [
						"console-fail-test/setup",
						"@flint.fyi/ts-patch/install-patch-hooks",
					],
					testTimeout: 10_000,
					typecheck: {
						enabled: true,
					},
				},
			}),
		),
	},
});
