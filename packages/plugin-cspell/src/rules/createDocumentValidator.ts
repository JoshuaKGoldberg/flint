// import { checkFilenameMatchesExcludeGlob } from "@cspell/cspell-lib";
import { toFileDirURL, toFileURL } from "@cspell/url";
import {
	checkFilenameMatchesGlob,
	createTextDocument,
	DocumentValidator,
} from "cspell-lib";

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

	const validator = new DocumentValidator(
		document,
		{ resolveImportsRelativeTo },
		{ import: ["cspell.json"] },
	);

	await validator.prepare();

	// GET THE FINALIZED SETTINGS TO ACCESS ignorePaths
	const finalSettings = validator.getFinalizedDocSettings();

	if (
		finalSettings.ignorePaths &&
		checkFilenameMatchesGlob(fileName, finalSettings.ignorePaths)
	) {
		return undefined;
	}

	return validator;
}
