import * as ts from "typescript";

import { json } from "../language.js";

export default json.createRule({
	about: {
		id: "duplicateKeys",
		preset: "logical",
	},
	messages: {
		duplicateKey: {
			primary:
				"This key is made redundant by an identical key later in the object.",
			secondary: [
				"Although JSON technically allows duplicate keys, using them is at best confusing.",
				"Most JSON parsers will ignore all but the last value for a given key.",
				"It's generally best to ensure that each key in a JSON object is unique.",
			],
			suggestions: [
				"If both values are meant to exist, change one of the keys to be different.",
				"If only the last value is meant to exist, you can remove any prior values.",
			],
		},
	},
	setup(context) {
		return {
			ObjectLiteralExpression(node) {
				const seenKeys = new Map<string, ts.StringLiteral>();

				for (const property of node.properties.toReversed()) {
					if (
						!ts.isPropertyAssignment(property) ||
						!ts.isStringLiteral(property.name)
					) {
						continue;
					}

					const key = property.name.text;
					const existingNode = seenKeys.get(key);

					if (!existingNode) {
						seenKeys.set(key, property.name);
						continue;
					}

					context.report({
						message: "duplicateKey",
						range: {
							begin: property.name.getStart(context.sourceFile) + 1,
							end: property.name.end + 1,
						},
					});
				}
			},
		};
	},
});
