import { toFileDirURL, toFileURL } from "@cspell/url";
import { createTextDocument, DocumentValidator } from "cspell-lib";

export async function getDocumentValidator(fileName: string, text: string) {
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
		{},
	);

	await validator.prepare();

	return validator;
}
