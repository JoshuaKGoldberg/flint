import { type RuleContext, runtimeBase } from "@flint.fyi/core";
import {
	getTSNodeRange,
	typescriptLanguage,
	type TypeScriptServices,
} from "@flint.fyi/ts";
import * as ts from "typescript";

const alternateProperties = new Set(["aria-label", "aria-labelledby", "title"]);

export default typescriptLanguage.createRule({
	about: {
		description: "Reports elements that require alt text but are missing it.",
		id: "altTexts",
		preset: "logical",
	},
	messages: {
		missingAlt: {
			primary:
				"{{ element }} element is missing alt text for non-visual users.",
			secondary: [
				"Alternative text provides a textual description for images and other media.",
				"Screen readers use this text to describe the element to users who cannot see it.",
				"This is required for WCAG 1.1.1 compliance.",
			],
			suggestions: [
				"Add an alt attribute with descriptive text",
				'Use alt="" for decorative images',
				"Use aria-label or aria-labelledby for alternative labeling",
			],
		},
	},
	setup() {
		return {
			...runtimeBase,
			visitors: {
				JsxOpeningElement: checkNode,
				JsxSelfClosingElement: checkNode,
			},
		};
	},
});

type Context = RuleContext<"missingAlt"> & TypeScriptServices;

function checkAltAttribute(
	attributes: ts.JsxAttributes,
	tagName: ts.JsxTagNameExpression,
	elementName: string,
	context: Context,
) {
	const properties = attributes.properties.find(
		(attr) =>
			ts.isJsxAttribute(attr) &&
			ts.isIdentifier(attr.name) &&
			attr.name.text === "alt",
	);

	const hasAriaLabel = attributes.properties.some(
		(attr) =>
			ts.isJsxAttribute(attr) &&
			ts.isIdentifier(attr.name) &&
			(attr.name.text === "aria-label" ||
				attr.name.text === "aria-labelledby") &&
			attr.initializer,
	);

	if (hasAriaLabel) {
		return;
	}

	if (!properties) {
		context.report({
			data: { element: elementName },
			message: "missingAlt",
			range: getTSNodeRange(tagName, context.sourceFile),
		});
		return;
	}

	if (ts.isJsxAttribute(properties)) {
		if (!properties.initializer) {
			context.report({
				data: { element: elementName },
				message: "missingAlt",
				range: getTSNodeRange(tagName, context.sourceFile),
			});
		} else if (ts.isJsxExpression(properties.initializer)) {
			const { expression } = properties.initializer;
			if (
				expression &&
				ts.isIdentifier(expression) &&
				expression.text === "undefined"
			) {
				context.report({
					data: { element: elementName },
					message: "missingAlt",
					range: getTSNodeRange(tagName, context.sourceFile),
				});
			}
		}
	}
}

function checkInputElement(
	attributes: ts.JsxAttributes,
	tagName: ts.JsxTagNameExpression,
	context: Context,
) {
	const typeAttribute = attributes.properties.find(
		(properties) =>
			ts.isJsxAttribute(properties) &&
			ts.isIdentifier(properties.name) &&
			properties.name.text === "type",
	);

	if (typeAttribute && ts.isJsxAttribute(typeAttribute)) {
		if (
			typeAttribute.initializer &&
			ts.isStringLiteral(typeAttribute.initializer) &&
			typeAttribute.initializer.text === "image"
		) {
			checkAltAttribute(attributes, tagName, "input[type='image']", context);
		}
	}
}

function checkNode(
	node: ts.JsxOpeningElement | ts.JsxSelfClosingElement,
	context: Context,
) {
	const { attributes, tagName } = node;
	if (!ts.isIdentifier(tagName)) {
		return;
	}

	const elementName = tagName.text.toLowerCase();

	if (elementName === "img" || elementName === "area") {
		checkAltAttribute(attributes, tagName, elementName, context);
	} else if (elementName === "input") {
		checkInputElement(attributes, tagName, context);
	} else if (elementName === "object") {
		checkObjectAccessibility(attributes, tagName, context);
	}
}

function checkObjectAccessibility(
	attributes: ts.JsxAttributes,
	tagName: ts.JsxTagNameExpression,
	context: Context,
) {
	if (
		!attributes.properties.some(
			(property) =>
				ts.isJsxAttribute(property) &&
				ts.isIdentifier(property.name) &&
				alternateProperties.has(property.name.text) &&
				property.initializer,
		)
	) {
		context.report({
			data: { element: "object" },
			message: "missingAlt",
			range: getTSNodeRange(tagName, context.sourceFile),
		});
	}
}
