import { readFileSafe } from "./readFileSafe.js";

export async function readGitignore() {
	return ((await readFileSafe(".gitignore")) ?? "")
		.trim()
		.split("\n")
		.filter(Boolean)
		.map((line) => (line.startsWith("/") ? line.slice(1) : line));
}
