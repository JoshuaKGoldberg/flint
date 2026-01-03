import { toFileDirURL, toFileURL } from "@cspell/url";
import {
	checkFilenameMatchesGlob,
	createTextDocument,
	CSpellSettings,
	DocumentValidator,
} from "cspell-lib";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Track whether we've already shown the missing config warning
let hasShownConfigWarning = false;

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

	let config: CSpellSettings = {};
	try {
		const configFile = (await import(configFileUrl, {
			with: { type: "json" },
		})) as { default: CSpellSettings };
		config = configFile.default;
	} catch (error) {
		// If cspell.json is not found, use an empty config and log a warning
		if (
			error instanceof Error &&
			"code" in error &&
			error.code === "ERR_MODULE_NOT_FOUND"
		) {
			if (!hasShownConfigWarning) {
				console.warn(
					"Warning: cspell.json config file not found. Using default configuration.",
				);
				hasShownConfigWarning = true;
			}
		} else {
			// Re-throw if it's a different error
			throw error;
		}
	}

	const validator = new DocumentValidator(
		document,
		{ resolveImportsRelativeTo },
		config,
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
