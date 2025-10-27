import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

// cspell:disable -- ARIA role names are correct
// Valid non-abstract ARIA roles from WAI-ARIA 1.2
const validAriaRoles = new Set([
	"alert",
	"alertdialog",
	"application",
	"article",
	"banner",
	"button",
	"cell",
	"checkbox",
	"columnheader",
	"combobox",
	"complementary",
	"contentinfo",
	"definition",
	"dialog",
	"directory",
	"document",
	"feed",
	"figure",
	"form",
	"grid",
	"gridcell",
	"group",
	"heading",
	"img",
	"link",
	"list",
	"listbox",
	"listitem",
	"log",
	"main",
	"marquee",
	"math",
	"menu",
	"menubar",
	"menuitem",
	"menuitemcheckbox",
	"menuitemradio",
	"meter",
	"navigation",
	"none",
	"note",
	"option",
	"presentation",
	"progressbar",
	"radio",
	"radiogroup",
	"region",
	"row",
	"rowgroup",
	"rowheader",
	"scrollbar",
	"search",
	"searchbox",
	"separator",
	"slider",
	"spinbutton",
	"status",
	"switch",
	"tab",
	"table",
	"tablist",
	"tabpanel",
	"term",
	"textbox",
	"timer",
	"toolbar",
	"tooltip",
	"tree",
	"treegrid",
	"treeitem",
]);

export default typescriptLanguage.createRule({
	about: {
		description: "Reports invalid or abstract ARIA roles.",
		id: "ariaRoles",
		preset: "logical",
	},
	messages: {
		invalidRole: {
			primary:
				"Invalid ARIA role '{{ role }}'. Use a valid, non-abstract role.",
			secondary: [
				"ARIA roles must be valid according to the WAI-ARIA specification.",
				"Abstract roles cannot be used directly in HTML.",
				"Required for WCAG 4.1.2 compliance.",
			],
			suggestions: [
				"Use a valid ARIA role from the WAI-ARIA specification",
				"Remove the role attribute if not needed",
			],
		},
	},
	setup(context) {
		function checkRole(attributes: ts.JsxAttributes) {
			const roleAttr = attributes.properties.find(
				(attr) =>
					ts.isJsxAttribute(attr) &&
					ts.isIdentifier(attr.name) &&
					attr.name.text === "role",
			);

			if (!roleAttr || !ts.isJsxAttribute(roleAttr)) {
				return;
			}

			// Only check string literal values
			if (roleAttr.initializer && ts.isStringLiteral(roleAttr.initializer)) {
				const role = roleAttr.initializer.text.trim();

				if (!role || !validAriaRoles.has(role)) {
					context.report({
						data: { role: role || "(empty)" },
						message: "invalidRole",
						range: getTSNodeRange(roleAttr, context.sourceFile),
					});
				}
			}
		}

		return {
			visitors: {
				JsxOpeningElement(node: ts.JsxOpeningElement) {
					checkRole(node.attributes);
				},
				JsxSelfClosingElement(node: ts.JsxSelfClosingElement) {
					checkRole(node.attributes);
				},
			},
		};
	},
});
