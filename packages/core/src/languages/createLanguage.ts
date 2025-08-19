import { debugForFile } from "debug-for-file";

import {
	CreateRule,
	Language,
	LanguageDefinition,
} from "../types/languages.js";
import { AnyRuleDefinition } from "../types/rules.js";
import { makeDisposable } from "./makeDisposable.js";

const log = debugForFile(import.meta.filename);

export function createLanguage<AstNodesByName, ContextServices extends object>(
	languageDefinition: LanguageDefinition,
) {
	const language: Language<AstNodesByName, ContextServices> = {
		...languageDefinition,

		createRule: ((ruleDefinition: AnyRuleDefinition) => {
			return {
				...ruleDefinition,
				language,
			};
		}) as CreateRule<AstNodesByName, ContextServices>,

		prepare() {
			log(
				"Preparing file factory for language: %s",
				languageDefinition.about.name,
			);

			const fileFactoryDefinition = languageDefinition.prepare();

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
	};

	return language;
}
