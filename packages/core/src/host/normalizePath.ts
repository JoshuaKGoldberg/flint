import { normalize } from "node:path";

export function normalizePath(path: string, caseSensitiveFS: boolean): string {
	const result = normalize(path).replaceAll("\\", "/").replaceAll(/\/$/g, "");
	if (caseSensitiveFS) {
		return result;
	}
	return result.toLowerCase();
}
