import * as fs from "node:fs/promises";
import * as prettier from "prettier";

export async function runPrettier(allFileContents: Map<string, string>) {
	let formattedCount = 0;

	// This is probably very slow for having lots of lookups and async calls.
	// Eventually we should investigate faster APIs.
	// https://github.com/prettier/prettier/issues/17422
	await Promise.all(
		Array.from(allFileContents).map(async ([filePath, originalFileContent]) => {
			const updatedFileContent = await prettier.format(originalFileContent, {
				// TODO: Quit hardcoding TypeScript!
				// The resolved language for each file should be piped through.
				// https://prettier.io/docs/options#parser
				parser: "typescript",
				...(await prettier.resolveConfig(filePath)),
			});

			if (originalFileContent === updatedFileContent) {
				return;
			}

			allFileContents.set(filePath, updatedFileContent);
			formattedCount += 1;

			await fs.writeFile(filePath, updatedFileContent);
		}),
	);

	return formattedCount;
}
