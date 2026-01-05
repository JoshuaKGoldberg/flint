import { debugForFile } from "debug-for-file";

import type {
	CreateRule,
	Language,
	LanguageDefinition,
} from "../types/languages.ts";
import type { AnyRuleDefinition } from "../types/rules.ts";
import { makeDisposable } from "./makeDisposable.ts";

const log = debugForFile(import.meta.filename);

export function createLanguage<AstNodesByName, ContextServices extends object>(
	languageDefinition: LanguageDefinition,
) {
	const language: Language<AstNodesByName, ContextServices> = {
		...languageDefinition,

		createFileFactory() {
			log(
				"Preparing file factory for language: %s",
				languageDefinition.about.name,
			);

			const fileFactoryDefinition = languageDefinition.createFileFactory();

			log("Prepared file factory.");

			const fileFactory = makeDisposable({
				...fileFactoryDefinition,
				prepareFromDisk: (filePathAbsolute: string) => {
					const { file, ...rest } =
						fileFactoryDefinition.prepareFromDisk(filePathAbsolute);

					return {
						file: makeDisposable(file),
						...rest,
					};
				},
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

		createRule: ((ruleDefinition: AnyRuleDefinition) => {
			return {
				...ruleDefinition,
				language,
			};
		}) as CreateRule<AstNodesByName, ContextServices>,
	};

	return language;
}
