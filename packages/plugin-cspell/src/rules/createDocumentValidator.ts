import { toFileDirURL, toFileURL } from "@cspell/url";
import {
	checkFilenameMatchesGlob,
	createTextDocument,
	CSpellSettings,
	DocumentValidator,
} from "cspell-lib";
import path from "node:path";

export async function createDocumentValidator(fileName: string, text: string) {
	const cwd = process.cwd();
	const document = createTextDocument({
		content: text,
		uri: fileName,
	});

	const resolveImportsRelativeTo = toFileURL(
		import.meta.url,
		toFileDirURL(cwd),
	);

	// It would be nice to use the DocumentValidator's `import` setting.
	// However, even with unique timestamps, cspell seemed to cache the import.
	// See: https://github.com/JoshuaKGoldberg/flint/issues/203
	const configFilePath = `cspell.json?timestamp=${performance.now()}`;
	const configFile = (await import(path.join(cwd, configFilePath), {
		with: { type: "json" },
	})) as { default: CSpellSettings };

	const validator = new DocumentValidator(
		document,
		{ resolveImportsRelativeTo },
		configFile.default,
	);

	await validator.prepare();

	const finalSettings = validator.getFinalizedDocSettings();

	if (
		finalSettings.ignorePaths &&
		checkFilenameMatchesGlob(fileName, finalSettings.ignorePaths)
	) {
		return undefined;
	}

	return validator;
}
