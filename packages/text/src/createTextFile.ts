import {
	createRuleRunner,
	LanguageFileDefinition,
	RuleContext,
	RuleVisitors,
} from "@flint.fyi/core";
import indexToPosition from "index-to-position";

import type { TextNodes, TextServices } from "./types.js";

export function createTextFile(
	filePathAbsolute: string,
	sourceText: string,
): LanguageFileDefinition<TextNodes, TextServices> {
	return {
		runRule: createRuleRunner<TextNodes, TextServices>(
			{
				filePathAbsolute,
				sourceText,
			},
			<MessageId extends string, FileContext extends object>(
				visitors: RuleVisitors<
					TextNodes,
					MessageId,
					FileContext & TextServices
				>,
				context: FileContext & RuleContext<MessageId> & TextServices,
			) => {
				visitors.file?.(sourceText, context);

				if (visitors.line) {
					const lines = sourceText.split(/\r\n|\n|\r/);
					for (const line of lines) {
						visitors.line(line, context);
					}
				}
			},
			(range) => ({
				begin: {
					...indexToPosition(sourceText, range.begin),
					raw: range.begin,
				},
				end: {
					...indexToPosition(sourceText, range.end),
					raw: range.end,
				},
			}),
		),
	};
}
