import { AnyLanguage } from "../types/languages.js";

export class VirtualFile {
	readonly filePathAbsolute: string;

	#languages: Set<AnyLanguage>;

	constructor(filePathAbsolute: string, languages: Iterable<AnyLanguage>) {
		this.filePathAbsolute = filePathAbsolute;
		this.#languages = new Set(languages);
	}

	addLanguages(languages: Set<AnyLanguage>) {
		this.#languages = this.#languages.union(languages);
	}

	getLanguages(): ReadonlySet<AnyLanguage> {
		return this.#languages;
	}
}
