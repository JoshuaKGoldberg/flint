import { toFileDirURL, toFileURL } from "@cspell/url";
import {
	checkFilenameMatchesGlob,
	createTextDocument,
	CSpellSettings,
	DocumentValidator,
} from "cspell-lib";
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
	const configFileUrlBase = pathToFileURL(configFilePath).href;
	const configFileUrl = `${configFileUrlBase}?timestamp=${performance.now()}`;
	const configFile = await loadConfigFile(configFileUrl, configFilePath);

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

/**
 * Loads the cspell.json configuration file.
 * @throws {Error} If the config file is missing, throws an error with `name === "Flint"` and `exitCode === 2`.
 *                  The CLI should handle this as a configuration error (exit code 2).
 */
async function loadConfigFile(url: string, path: string) {
	try {
		return (await import(url, {
			with: { type: "json" },
		})) as { default: CSpellSettings };
	} catch (error) {
		const maybeErrno = error as { code?: unknown; message?: unknown };
		if (maybeErrno.code === "ERR_MODULE_NOT_FOUND") {
			const missingConfigError = new Error(
				`Missing required cspell.json for the spelling plugin (expected at ${path}).\n` +
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
}
