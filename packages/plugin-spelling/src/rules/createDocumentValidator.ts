import { toFileDirURL, toFileURL } from "@cspell/url";
import {
	checkFilenameMatchesGlob,
	createTextDocument,
	CSpellSettings,
	DocumentValidator,
} from "cspell-lib";
import * as fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

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
	// See: https://github.com/flint-fyi/flint/issues/203
	const configFilePath = path.join(cwd, "cspell.json");
	try {
		await fs.access(configFilePath);
	} catch (error) {
		const maybeErrno = error as { code?: unknown; message?: unknown };
		if (maybeErrno.code === "ENOENT") {
			const missingConfigError = new Error(
				`Missing required cspell.json for the spelling plugin (expected at ${configFilePath}).\n` +
					'Create a `cspell.json` in your repo root or disable the "spelling/cspell" rule.',
			);
			missingConfigError.name = "Flint";
			// Avoid a scary stack trace for a common configuration issue.
			// Node prints uncaught errors using the `.stack` property when present.
			// Deleting it results in a concise error without stack frames.
			delete missingConfigError.stack;
			throw missingConfigError;
		}

		throw error;
	}

	const configFileUrlBase = pathToFileURL(configFilePath).href;
	const configFileUrl = `${configFileUrlBase}?timestamp=${performance.now()}`;
	const configFile = (await import(configFileUrl, {
		// eslint-disable-next-line jsdoc/no-bad-blocks
		/* @vite-ignore */
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
