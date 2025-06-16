import * as fs from "node:fs/promises";

import { AnyLanguage } from "../types/languages.js";

export class VirtualFile {
	readonly filePathAbsolute: string;

	#languages: Set<AnyLanguage>;
	#text: string;

	constructor(
		filePathAbsolute: string,
		languages: Iterable<AnyLanguage>,
		text: string,
	) {
		this.filePathAbsolute = filePathAbsolute;
		this.#languages = new Set(languages);
		this.#text = text;
	}

	addLanguages(languages: Set<AnyLanguage>) {
		this.#languages = this.#languages.union(languages);
	}

	getLanguages(): ReadonlySet<AnyLanguage> {
		return this.#languages;
	}

	getText() {
		return this.#text;
	}

	async updateText(text: string) {
		this.#text = text;

		// TODO: Eventually, the file system should be abstracted
		// Direct fs write calls don't make sense in e.g. virtual file systems
		// https://github.com/JoshuaKGoldberg/flint/issues/69
		// https://github.com/JoshuaKGoldberg/flint/issues/73
		await fs.writeFile(this.filePathAbsolute, text);
	}
}
