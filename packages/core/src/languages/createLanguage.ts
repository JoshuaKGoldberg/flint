import { CachedFactory } from "cached-factory";
import { debugForFile } from "debug-for-file";

import { Language, LanguageDefinition } from "../types/languages.js";
import { createRule } from "../types/rule-builder.js";
import { makeDisposable } from "./makeDisposable.js";

const log = debugForFile(import.meta.filename);

export function createLanguage<
	const AstNodesByName,
	const ContextServices extends object,
>(
	languageDefinition: LanguageDefinition<AstNodesByName, ContextServices>,
): Language<AstNodesByName, ContextServices> {
	const language: Language<AstNodesByName, ContextServices> = {
		...languageDefinition,

		buildRule: () => createRule(language),
		createRule: (ruleDefinition) => {
			return {
				...ruleDefinition,
				language,
			};
		},

		createStatefulRule: (ruleDefinition) => {
			return {
				...ruleDefinition,
				language,
			};
		},

		prepare() {
			log(
				"Preparing file factory for language: %s",
				languageDefinition.about.name,
			);

			const fileFactoryDefinition = languageDefinition.prepare();

			log("Prepared file factory.");

			const fileFactory = makeDisposable({
				...fileFactoryDefinition,
				prepareFromDisk: new CachedFactory((filePathAbsolute: string) => {
					const { file, ...rest } =
						fileFactoryDefinition.prepareFromDisk(filePathAbsolute);

					return {
						file: makeDisposable(file),
						...rest,
					};
				}),
				prepareFromVirtual: (filePathAbsolute: string, sourceText: string) => {
					const { file, ...rest } = fileFactoryDefinition.prepareFromVirtual(
						filePathAbsolute,
						sourceText,
					);

					return {
						file: makeDisposable(file),
						...rest,
					};
				},
			});

			return fileFactory;
		},
	};

	return language;
}
