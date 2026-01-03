import { normalize } from "node:path";

export function normalizePath(path: string): string {
	return normalize(path).replaceAll("\\", "/");
}
