import { parseJsonSafe } from "@flint.fyi/utils";

import { readFileSafe } from "./readFileSafe.js";

export async function readFileSafeAsJson(filePath: string) {
	return parseJsonSafe(await readFileSafe(filePath));
}
