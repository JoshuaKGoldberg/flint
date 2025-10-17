import * as ts from "typescript";
import z from "zod";

import { jsonLanguage } from "../language.js";

export default jsonLanguage.createRule({
	about: {
		description:
			"Reports object keys that are not normalized using Unicode normalization forms.",
		id: "keyNormalization",
		preset: "logical",
	},
	messages: {
		unnormalizedKey: {
			primary:
				"This key is not normalized using the {{ form }} normalization form.",
			secondary: [
				"Unicode characters can sometimes have multiple representations that look identical but are technically different character sequences.",
				"Using normalized Unicode ensures consistent representation of text, which is important for key comparison, sorting, and searching operations.",
			],
			suggestions: [
				"Normalize the key using the {{ form }} normalization form.",
			],
		},
	},
	options: {
		form: z
			.enum(["NFC", "NFD", "NFKC", "NFKD"])
			.default("NFC")
			.describe(
				"Unicode normalization form to use when checking keys. Must be one of: NFC (default), NFD, NFKC, or NFKD.",
			),
	},
	setup(context, { form = "NFC" }) {
		return {
			visitors: {
				ObjectLiteralExpression(node) {
					for (const property of node.properties) {
						if (
							!ts.isPropertyAssignment(property) ||
							!ts.isStringLiteral(property.name)
						) {
							continue;
						}

						const key = property.name.text;
						const normalizedKey = key.normalize(form);

						if (key === normalizedKey) {
							continue;
						}

						context.report({
							data: { form },
							message: "unnormalizedKey",
							range: {
								begin: property.name.getStart(context.sourceFile),
								end: property.name.end,
							},
						});
					}
				},
			},
		};
	},
});
