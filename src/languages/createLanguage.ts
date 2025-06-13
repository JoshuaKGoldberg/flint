import { debugForFile } from "debug-for-file";

import {
	CreateRule,
	Language,
	LanguageDefinition,
} from "../types/languages.js";
import { AnyRuleDefinition } from "../types/rules.js";
import { makeDisposable, makeDisposableCurried } from "./makeDisposable.js";

const log = debugForFile(import.meta.filename);

export function createLanguage<ContextServices extends object>(
	languageDefinition: LanguageDefinition,
) {
	const language: Language<ContextServices> = {
		...languageDefinition,

		createRule: ((ruleDefinition: AnyRuleDefinition) => {
			return {
				...ruleDefinition,
				language,
			};
		}) as CreateRule<ContextServices>,

		prepare() {
			log(
				"Preparing file factory for language: %s",
				languageDefinition.about.name,
			);

			const fileFactoryDefinition = languageDefinition.prepare();

			log("Prepared file factory.");

			const fileFactory = makeDisposable({
				...fileFactoryDefinition,
				prepareFileOnDisk: makeDisposableCurried(
					fileFactoryDefinition.prepareFileOnDisk.bind(fileFactoryDefinition),
				),
				prepareFileVirtually: makeDisposableCurried(
					fileFactoryDefinition.prepareFileVirtually.bind(
						fileFactoryDefinition,
					),
				),
			});

			return fileFactory;
		},
	};

	return language;
}
