import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const requiredAriaPropsForRole: Record<string, string[]> = {
	checkbox: ["aria-checked"],
	combobox: ["aria-controls", "aria-expanded"],
	gridcell: [],
	heading: ["aria-level"],
	link: [],
	menuitemcheckbox: ["aria-checked"],
	menuitemradio: ["aria-checked"],
	option: ["aria-selected"],
	radio: ["aria-checked"],
	scrollbar: [
		"aria-controls",
		"aria-valuenow",
		"aria-valuemax",
		"aria-valuemin",
	],
	searchbox: [],
	separator: [],
	slider: ["aria-valuenow", "aria-valuemax", "aria-valuemin"],
	spinbutton: ["aria-valuenow", "aria-valuemax", "aria-valuemin"],
	switch: ["aria-checked"],
	tab: [],
	tabpanel: [],
	textbox: [],
	treeitem: [],
};

export default typescriptLanguage.createRule({
	about: {
		description: "Reports ARIA roles missing their required ARIA properties.",
		id: "roleRequiredAriaProps",
		preset: "logical",
	},
	messages: {
		missingRequiredProps: {
			primary:
				"Elements with ARIA role `{{ role }}` must have the following ARIA properties defined: {{ props }}.",
			secondary: [
				"ARIA roles define how elements are exposed to assistive technologies.",
				"Some roles require specific ARIA properties to function correctly.",
				"This is required for WCAG 4.1.2 compliance.",
			],
			suggestions: ["Add the required ARIA properties to the element."],
		},
	},
	setup(context) {
		function checkElement(node: ts.JsxOpeningLikeElement) {
			const roleAttribute = node.attributes.properties.find(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "role",
			);

			if (
				!roleAttribute ||
				!ts.isJsxAttribute(roleAttribute) ||
				!roleAttribute.initializer ||
				!ts.isStringLiteral(roleAttribute.initializer)
			) {
				return;
			}

			const role = roleAttribute.initializer.text.toLowerCase();
			const requiredProps = requiredAriaPropsForRole[role];

			if (!requiredProps || requiredProps.length === 0) {
				return;
			}

			const existingProps = new Set<string>();
			for (const property of node.attributes.properties) {
				if (!ts.isJsxAttribute(property) || !ts.isIdentifier(property.name)) {
					continue;
				}

				const propertyName = property.name.text.toLowerCase();
				if (propertyName.startsWith("aria-")) {
					existingProps.add(propertyName);
				}
			}

			const missingProps = requiredProps.filter(
				(prop) => !existingProps.has(prop),
			);

			if (missingProps.length > 0) {
				context.report({
					data: {
						props: missingProps.join(", "),
						role,
					},
					message: "missingRequiredProps",
					range: getTSNodeRange(roleAttribute, context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				JsxOpeningElement: checkElement,
				JsxSelfClosingElement: checkElement,
			},
		};
	},
});
