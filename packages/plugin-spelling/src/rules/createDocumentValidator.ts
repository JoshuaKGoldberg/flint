import { toFileDirURL, toFileURL } from "@cspell/url";
import {
	createTextDocument,
	CSpellSettings,
	DocumentValidator,
} from "cspell-lib";
import path from "node:path";
import { pathToFileURL } from "node:url";

export interface CreatedDocumentValidator {
	cspellSettings: CSpellSettings;
	documentValidator: DocumentValidator;
}

export async function createDocumentValidator(): Promise<CreatedDocumentValidator> {
	const cwd = process.cwd();
	const document = createTextDocument({
		content: "",
		uri: "file.txt",
	});

	const resolveImportsRelativeTo = toFileURL(
		import.meta.url,
		toFileDirURL(cwd),
	);

	// It would be nice to use the DocumentValidator's `import` setting.
	// However, even with unique timestamps, cspell seemed to cache the import.
	// See: https://github.com/JoshuaKGoldberg/flint/issues/203
	const configFilePath = path.join(cwd, "cspell.json");
	const configFileUrlBase = pathToFileURL(configFilePath).href;
	const configFileUrl = `${configFileUrlBase}?timestamp=${performance.now()}`;
	const configFile = (await import(configFileUrl, {
		// eslint-disable-next-line jsdoc/no-bad-blocks
		/* @vite-ignore */
		with: { type: "json" },
	})) as { default: CSpellSettings };

	const documentValidator = new DocumentValidator(
		document,
		{ resolveImportsRelativeTo },
		configFile.default,
	);

	await documentValidator.prepare();

	const cspellSettings = documentValidator.getFinalizedDocSettings();

	return { cspellSettings, documentValidator };
}
