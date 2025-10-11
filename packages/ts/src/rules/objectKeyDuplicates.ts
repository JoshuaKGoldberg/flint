import * as ts from "typescript";

import { typescriptLanguage } from "../language.js";

function getPropertyKeyName(
	property: ts.ObjectLiteralElementLike,
): string | undefined {
	if (
		ts.isPropertyAssignment(property) ||
		ts.isMethodDeclaration(property) ||
		ts.isGetAccessorDeclaration(property) ||
		ts.isSetAccessorDeclaration(property)
	) {
		const { name } = property;

		// Prefix getters and setters to treat them as distinct from each other and from regular properties
		let prefix = "";
		if (ts.isGetAccessorDeclaration(property)) {
			prefix = "get:";
		} else if (ts.isSetAccessorDeclaration(property)) {
			prefix = "set:";
		}

		if (ts.isIdentifier(name)) {
			return prefix + name.text;
		}

		if (ts.isStringLiteral(name)) {
			return prefix + name.text;
		}

		if (ts.isNumericLiteral(name)) {
			return prefix + name.text;
		}
	}

	if (ts.isShorthandPropertyAssignment(property)) {
		return property.name.text;
	}

	return undefined;
}

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports unnecessary duplicate keys that override previous values.",
		id: "objectKeyDuplicates",
		preset: "logical",
	},
	messages: {
		duplicateKey: {
			primary:
				"This key is made redundant by an identical key later in the object.",
			secondary: [
				"Duplicate object keys are legal in JavaScript, but they can lead to unexpected behavior.",
				"When duplicate keys exist, only the last value for a given key is used.",
				"This can cause confusion and bugs, especially when maintaining the code.",
			],
			suggestions: [
				"If both values are meant to exist, change one of the keys to be different.",
				"If only the last value is meant to exist, remove any prior values.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				ObjectLiteralExpression(node) {
					const seenKeys = new Map<string, ts.Node>();

					for (const property of node.properties.toReversed()) {
						const key = getPropertyKeyName(property);

						if (key === undefined) {
							continue;
						}

						const existingNode = seenKeys.get(key);

						if (!existingNode) {
							seenKeys.set(key, property);
							continue;
						}

						const keyNode = ts.isShorthandPropertyAssignment(property)
							? property.name
							: (property as ts.PropertyAssignment).name;

						context.report({
							message: "duplicateKey",
							range: {
								begin: keyNode.getStart(context.sourceFile),
								end: keyNode.end,
							},
						});
					}
				},
			},
		};
	},
});
