import * as ts from "typescript";
import { z } from "zod";

import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports using specific TypeScript AST node types that are restricted by configuration.",
		id: "restrictedSyntax",
		preset: "None",
	},
	messages: {
		restrictedSyntax: {
			primary: "Using '{{ selector }}' is not allowed.",
			secondary: [
				"This syntax pattern has been restricted by your project's linting configuration.",
				"{{ message }}",
			],
			suggestions: [
				"Consider using an alternative syntax pattern that accomplishes the same goal without the restricted construct.",
			],
		},
	},
	options: {
		selectors: z
			.array(
				z.union([
					z.string(),
					z.object({
						message: z.string().optional(),
						selector: z.string(),
					}),
				]),
			)
			.describe(
				"Array of TypeScript AST node type names to restrict, or objects with selector and custom message.",
			),
	},
	setup(context, { selectors }) {
		if (!selectors || selectors.length === 0) {
			return;
		}

		const restrictedSelectors = new Map<
			string,
			{ message?: string; selector: string }
		>();

		for (const item of selectors) {
			if (typeof item === "string") {
				restrictedSelectors.set(item, { selector: item });
			} else {
				restrictedSelectors.set(item.selector, item);
			}
		}

		const visitors: Record<string, (node: ts.Node) => void> = {};

		for (const [selector, config] of restrictedSelectors) {
			visitors[selector] = (node: ts.Node) => {
				context.report({
					data: {
						message: config.message ?? "",
						selector,
					},
					message: "restrictedSyntax",
					range: {
						begin: node.getStart(context.sourceFile),
						end: node.getEnd(),
					},
				});
			};
		}

		return {
			visitors,
		};
	},
});
