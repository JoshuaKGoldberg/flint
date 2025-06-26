import { readFileSafe } from "./readFileSafe.js";

export async function readFileSafeAsJson(filePath: string) {
	try {
		const text = await readFileSafe(filePath);

		return text && (JSON.parse(text) as unknown);
	} catch {
		return undefined;
	}
}
