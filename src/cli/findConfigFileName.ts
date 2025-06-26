import fs from "node:fs/promises";

const candidatesOrdered = [
	"flint.config.ts",
	"flint.config.mts",
	"flint.config.cts",
	"flint.config.mjs",
	"flint.config.cjs",
	"flint.config.js",
];

export async function findConfigFileName(directory: string) {
	const children = new Set(await fs.readdir(directory));

	const fileName = candidatesOrdered.find((candidate) =>
		children.has(candidate),
	);

	return fileName;
}
