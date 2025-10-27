import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

// cspell:disable -- ARIA role names are correct
// Map of HTML elements to their implicit ARIA roles
const implicitRoles: Record<string, string> = {
	a: "link", // when href is present
	article: "article",
	aside: "complementary",
	button: "button",
	dialog: "dialog",
	footer: "contentinfo",
	form: "form",
	h1: "heading",
	h2: "heading",
	h3: "heading",
	h4: "heading",
	h5: "heading",
	h6: "heading",
	header: "banner",
	hr: "separator",
	img: "img",
	input: "textbox", // varies by type
	li: "listitem",
	main: "main",
	nav: "navigation",
	ol: "list",
	section: "region",
	select: "listbox",
	textarea: "textbox",
	ul: "list",
};

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports redundant ARIA roles on elements with implicit roles.",
		id: "roleRedundancies",
		preset: "logical",
	},
	messages: {
		redundantRole: {
			primary:
				"Redundant role '{{ role }}' on <{{ element }}>. This element already has an implicit role.",
			secondary: [
				"HTML elements have default semantics implemented by the browser.",
				"Setting an explicit role that matches the implicit role is unnecessary.",
				"Remove the redundant role attribute.",
			],
			suggestions: ["Remove the redundant role attribute"],
		},
	},
	setup(context) {
		function checkRedundantRole(
			tagName: ts.JsxTagNameExpression,
			attributes: ts.JsxAttributes,
		) {
			if (!ts.isIdentifier(tagName)) {
				return;
			}

			const elementName = tagName.text.toLowerCase();
			const implicitRole = implicitRoles[elementName];

			if (!implicitRole) {
				return; // No implicit role for this element
			}

			const roleAttr = attributes.properties.find(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "role",
			);

			if (!roleAttr || !ts.isJsxAttribute(roleAttr)) {
				return;
			}

			// Check if role value matches implicit role
			if (roleAttr.initializer && ts.isStringLiteral(roleAttr.initializer)) {
				const explicitRole = roleAttr.initializer.text;

				if (explicitRole === implicitRole) {
					context.report({
						data: { element: elementName, role: explicitRole },
						message: "redundantRole",
						range: getTSNodeRange(roleAttr, context.sourceFile),
					});
				}
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkRedundantRole(node.tagName, node.attributes);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkRedundantRole(node.tagName, node.attributes);
				},
			},
		};
	},
});
