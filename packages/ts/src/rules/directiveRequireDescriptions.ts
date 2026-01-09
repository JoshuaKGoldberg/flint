import * as tsutils from "ts-api-utils";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Require descriptions in flint directive comments.",
		id: "directiveRequireDescriptions",
		preset: "stylistic",
	},
	messages: {
		missingDescription: {
			primary: "Flint directive comments should include a description.",
			secondary: [
				"Adding a description explains why the rule is being disabled.",
				"Descriptions help future developers understand the context of the disable.",
			],
			suggestions: [
				"Add a description after the rule name, separated by ' -- '.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				SourceFile: (_, { sourceFile }) => {
					tsutils.forEachComment(sourceFile, (fullText, sourceRange) => {
						const commentText = fullText.slice(
							sourceRange.pos,
							sourceRange.end,
						);

						const match =
							/^\/\/\s*flint-(disable-next-line|disable-line|disable|enable)(?:\s+(.*))?/.exec(
								commentText,
							);
						if (!match) {
							return;
						}

						const directiveType = match[1];
						const rest = match[2]?.trim() ?? "";

						if (directiveType === "enable") {
							return;
						}

						if (!rest) {
							context.report({
								message: "missingDescription",
								range: {
									begin: sourceRange.pos,
									end: sourceRange.end,
								},
							});
							return;
						}

						const hasDescription = rest.includes(" -- ");
						if (!hasDescription) {
							context.report({
								message: "missingDescription",
								range: {
									begin: sourceRange.pos,
									end: sourceRange.end,
								},
							});
						}
					});
				},
			},
		};
	},
});
