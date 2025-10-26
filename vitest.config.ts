import { readdirSync } from "node:fs";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		projects: readdirSync("./packages").map((name) => ({
			test: {
				clearMocks: true,
				include: ["**/src/**/*.test.ts"],
				name,
				root: `./packages/${name}`,
				setupFiles: [
					"console-fail-test/setup",
					...(name === "vue" ? ["./src/setup-tests.ts"] : []),
				],
				testTimeout: 10_000,
			},
		})),
	},
});
