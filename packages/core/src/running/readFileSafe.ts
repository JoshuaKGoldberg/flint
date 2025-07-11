import * as fs from "node:fs/promises";

export async function readFileSafe(filePath: string) {
	try {
		return await fs.readFile(filePath, "utf-8");
	} catch {
		return undefined;
	}
}
