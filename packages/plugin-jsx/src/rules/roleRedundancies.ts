import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const implicitRoles: Record<string, string> = {
	a: "link",
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
	input: "textbox",
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
				"`<{{ element }}>` elements already implicitly have a role of `{{ role }}`. This explicit role is unnecessary.",
			secondary: [
				"HTML elements have default semantics implemented by the browser.",
				"Setting an explicit role that matches the implicit role is redundant and doesn't provide any benefit.",
			],
			suggestions: ["Remove the redundant role attribute"],
		},
	},
	setup(context) {
		function checkRedundantRole(node: ts.JsxOpeningLikeElement) {
			if (!ts.isIdentifier(node.tagName)) {
				return;
			}

			const element = node.tagName.text.toLowerCase();
			const implicitRole = implicitRoles[element];

			if (!implicitRole) {
				return;
			}

			const roleProperty = node.attributes.properties.find(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "role",
			);

			if (
				roleProperty &&
				ts.isJsxAttribute(roleProperty) &&
				roleProperty.initializer &&
				ts.isStringLiteral(roleProperty.initializer) &&
				roleProperty.initializer.text === implicitRole
			) {
				const range = getTSNodeRange(roleProperty, context.sourceFile);
				context.report({
					data: {
						element,
						role: roleProperty.initializer.text,
					},
					message: "redundantRole",
					range,
					suggestions: [
						{
							id: "removeRole",
							range,
							text: "",
						},
					],
				});
			}
		}

		return {
			visitors: {
				JsxOpeningElement: checkRedundantRole,
				JsxSelfClosingElement: checkRedundantRole,
			},
		};
	},
});
