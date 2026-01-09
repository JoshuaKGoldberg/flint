import * as tsutils from "ts-api-utils";

import { typescriptLanguage } from "../language.ts";

interface DirectiveInfo {
	begin: number;
	end: number;
	selection: string;
	type: string;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Require a flint-enable comment for every flint-disable comment.",
		id: "directivePairs",
		preset: "logical",
	},
	messages: {
		missingEnable: {
			primary:
				"This flint-disable directive is missing a corresponding flint-enable.",
			secondary: [
				"flint-disable directives without a matching flint-enable will disable rules for the rest of the file.",
				"This may cause you to miss legitimate linting issues.",
			],
			suggestions: ["Add a flint-enable directive after the disabled code."],
		},
	},
	setup(context) {
		return {
			visitors: {
				SourceFile: (_, { sourceFile }) => {
					const directives: DirectiveInfo[] = [];

					tsutils.forEachComment(sourceFile, (fullText, sourceRange) => {
						const commentText = fullText.slice(
							sourceRange.pos,
							sourceRange.end,
						);
						const match = /^\/\/\s*flint-(\S+)(?:\s+(.+))?/.exec(commentText);
						if (!match) {
							return;
						}

						const type = match[1] ?? "";
						const selection = match[2] ?? "";

						directives.push({
							begin: sourceRange.pos,
							end: sourceRange.end,
							selection,
							type,
						});
					});

					const disables = new Map<string, DirectiveInfo[]>();

					for (const directive of directives) {
						const selection = directive.selection || "*";

						if (directive.type === "disable") {
							const existing = disables.get(selection);
							if (existing) {
								existing.push(directive);
							} else {
								disables.set(selection, [directive]);
							}
						} else if (directive.type === "enable") {
							const stack = disables.get(selection);
							if (stack && stack.length > 0) {
								stack.pop();
							}
						}
					}

					for (const [, remaining] of disables) {
						for (const directive of remaining) {
							context.report({
								message: "missingEnable",
								range: {
									begin: directive.begin,
									end: directive.end,
								},
							});
						}
					}
				},
			},
		};
	},
});
