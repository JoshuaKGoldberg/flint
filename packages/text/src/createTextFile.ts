import type { LanguageFileDefinition } from "@flint.fyi/core";
import indexToPosition from "index-to-position";

export function createTextFile(
	filePathAbsolute: string,
	sourceText: string,
): LanguageFileDefinition {
	return {
		normalizeRange: (range) => ({
			begin: {
				...indexToPosition(sourceText, range.begin),
				raw: range.begin,
			},
			end: {
				...indexToPosition(sourceText, range.end),
				raw: range.end,
			},
		}),
		runVisitors(runtime, options) {
			const fileServices = { filePathAbsolute, options, sourceText };

			if (runtime.visitors) {
				runtime.visitors.file?.(sourceText, fileServices);

				if (runtime.visitors.line) {
					const lines = sourceText.split(/\r\n|\n|\r/);
					for (const line of lines) {
						runtime.visitors.line(line, fileServices);
					}
				}
			}
		},
	};
}
