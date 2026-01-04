import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports unnecessary duplicate keys that override previous values.",
		id: "objectKeyDuplicates",
		preset: "untyped",
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
				ObjectLiteralExpression(node, { sourceFile }) {
					const seenKeys = {
						getters: new Map<string, ts.Node>(),
						setters: new Map<string, ts.Node>(),
						values: new Map<string, ts.Node>(),
					};

					for (const property of node.properties.toReversed()) {
						const key = getPropertyKeyName(property);
						if (!key) {
							continue;
						}

						const existingNode = seenKeys[key.group].get(key.text);

						if (existingNode) {
							context.report({
								message: "duplicateKey",
								range: getTSNodeRange(key.node, sourceFile),
							});
						}

						seenKeys[key.group].set(key.text, property);
					}
				},
			},
		};
	},
});

// TODO: Reuse a shared getStaticValue-style utility?
function getNameText(name: ts.PropertyName) {
	if (
		ts.isIdentifier(name) ||
		ts.isStringLiteral(name) ||
		ts.isNumericLiteral(name) ||
		ts.isLiteralExpression(name)
	) {
		return name.text;
	}

	if (ts.isPrivateIdentifier(name)) {
		return `#${name.text}`;
	}

	return undefined;
}

function getPropertyKeyName(property: ts.ObjectLiteralElementLike) {
	if (ts.isShorthandPropertyAssignment(property)) {
		return {
			group: "values",
			node: property.name,
			text: property.name.text,
		} as const;
	}

	if (
		ts.isPropertyAssignment(property) ||
		ts.isMethodDeclaration(property) ||
		ts.isGetAccessorDeclaration(property) ||
		ts.isSetAccessorDeclaration(property)
	) {
		const { name } = property;
		const text = getNameText(name);
		if (!text) {
			return undefined;
		}

		const group = ts.isGetAccessorDeclaration(property)
			? "getters"
			: ts.isSetAccessorDeclaration(property)
				? "setters"
				: "values";

		return { group, node: name, text } as const;
	}

	return undefined;
}
