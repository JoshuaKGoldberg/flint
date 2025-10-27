import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

// cspell:disable -- ARIA role names are correct
// Map of ARIA roles to their semantic HTML element equivalents
const roleToElement: Record<string, string> = {
	article: "article",
	banner: "header",
	button: "button",
	checkbox: "input[type='checkbox']",
	complementary: "aside",
	contentinfo: "footer",
	definition: "dd",
	dialog: "dialog",
	figure: "figure",
	form: "form",
	heading: "h1-h6",
	img: "img",
	link: "a",
	list: "ul/ol",
	listitem: "li",
	main: "main",
	navigation: "nav",
	radio: "input[type='radio']",
	region: "section",
	row: "tr",
	rowgroup: "thead/tbody/tfoot",
	table: "table",
	term: "dt",
	textbox: "input[type='text']/textarea",
};

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports ARIA roles that have semantic HTML element equivalents.",
		id: "roleTags",
		preset: "logical",
	},
	messages: {
		preferSemanticElement: {
			primary:
				"Use <{{ element }}> instead of <{{ currentElement }}> with role='{{ role }}'.",
			secondary: [
				"Semantic HTML elements have built-in accessibility features.",
				"Using native elements is more maintainable than ARIA roles.",
				"Browsers provide better default behavior for semantic elements.",
			],
			suggestions: ["Replace with the semantic HTML element"],
		},
	},
	setup(context) {
		function checkRole(
			tagName: ts.JsxTagNameExpression,
			attributes: ts.JsxAttributes,
		) {
			if (!ts.isIdentifier(tagName)) {
				return;
			}

			const currentElement = tagName.text.toLowerCase();

			// Find role attribute
			const roleAttr = attributes.properties.find(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "role",
			);

			if (!roleAttr || !ts.isJsxAttribute(roleAttr)) {
				return;
			}

			// Check if role value has a semantic equivalent
			if (roleAttr.initializer && ts.isStringLiteral(roleAttr.initializer)) {
				const role = roleAttr.initializer.text;
				const semanticElement = roleToElement[role];

				if (semanticElement) {
					context.report({
						data: {
							currentElement,
							element: semanticElement,
							role,
						},
						message: "preferSemanticElement",
						range: getTSNodeRange(roleAttr, context.sourceFile),
					});
				}
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkRole(node.tagName, node.attributes);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkRole(node.tagName, node.attributes);
				},
			},
		};
	},
});
