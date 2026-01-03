import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createDocumentValidator } from "./createDocumentValidator.js";

describe("createDocumentValidator", () => {
	let cwd: string;

	beforeEach(async () => {
		cwd = await fs.mkdtemp(path.join(os.tmpdir(), "flint-test-"));
		vi.spyOn(process, "cwd").mockReturnValue(cwd);
	});

	afterEach(async () => {
		await fs.rm(cwd, { force: true, recursive: true });
		vi.restoreAllMocks();
	});

	it("should create validator when cspell.json exists", async () => {
		await fs.writeFile(
			path.join(cwd, "cspell.json"),
			JSON.stringify({ words: ["flint"] }),
		);

		const validator = await createDocumentValidator("test.ts", "some text");

		expect(validator).toBeDefined();
	});

	it("should throw Flint error when cspell.json is missing", async () => {
		await expect(
			createDocumentValidator("test.ts", "some text"),
		).rejects.toMatchObject({
			message: expect.stringContaining(
				"Missing required cspell.json for the spelling plugin",
			),
			name: "Flint",
		});
	});
});
