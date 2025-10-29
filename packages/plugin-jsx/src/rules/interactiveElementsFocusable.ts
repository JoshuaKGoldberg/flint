import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

const interactiveHandlers = [
	"onClick",
	"onKeyDown",
	"onKeyPress",
	"onKeyUp",
	"onMouseDown",
	"onMouseUp",
];

const interactiveRoles = new Set([
	"button",
	"checkbox",
	"columnheader",
	"combobox",
	"grid",
	"gridcell",
	"link",
	"listbox",
	"menu",
	"menubar",
	"menuitem",
	"menuitemcheckbox",
	"menuitemradio",
	"option",
	"progressbar",
	"radio",
	"radiogroup",
	"row",
	"rowheader",
	"searchbox",
	"slider",
	"spinbutton",
	"switch",
	"tab",
	"tablist",
	"textbox",
	"toolbar",
	"tree",
	"treegrid",
	"treeitem",
]);

const inherentlyFocusableElements = new Set([
	"a",
	"audio",
	"button",
	"input",
	"select",
	"textarea",
	"video",
]);

const nonInteractiveElements = new Set([
	"article",
	"aside",
	"body",
	"br",
	"details",
	"div",
	"footer",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"header",
	"hr",
	"img",
	"li",
	"main",
	"nav",
	"ol",
	"p",
	"section",
	"span",
	"table",
	"td",
	"ul",
]);

const nonInteractiveRoles = new Set([
	"article",
	"banner",
	"complementary",
	"img",
	"listitem",
	"main",
	"navigation",
	"region",
	"tooltip",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports interactive elements that are not focusable via keyboard.",
		id: "interactiveElementsFocusable",
		preset: "logical",
	},
	messages: {
		notFocusable: {
			primary:
				"Elements with the '{{ role }}' interactive role must be focusable.",
			secondary: [
				"Interactive elements must be reachable via keyboard navigation.",
				"Add a tabIndex attribute or use an inherently focusable element.",
				"This is required for WCAG 2.1.1 compliance.",
			],
			suggestions: [
				"Add tabIndex={0} to make the element tabbable",
				"Add tabIndex={-1} to make the element programmatically focusable",
				"Use a native interactive element like <button> or <a>",
			],
		},
	},
	setup(context) {
		function getTabIndexValue(node: ts.JsxOpeningLikeElement) {
			const tabIndexProperty = node.attributes.properties.find(
				(property): property is ts.JsxAttribute =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "tabIndex",
			);

			if (!tabIndexProperty?.initializer) {
				return undefined;
			}

			if (ts.isJsxExpression(tabIndexProperty.initializer)) {
				const expression = tabIndexProperty.initializer.expression;
				if (expression && ts.isNumericLiteral(expression)) {
					return Number(expression.text);
				}
			}

			if (ts.isStringLiteral(tabIndexProperty.initializer)) {
				return Number(tabIndexProperty.initializer.text);
			}

			return undefined;
		}

		function getRoleValue(node: ts.JsxOpeningLikeElement) {
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
				ts.isStringLiteral(roleProperty.initializer)
			) {
				return roleProperty.initializer.text;
			}

			return undefined;
		}

		function isAriaHidden(node: ts.JsxOpeningLikeElement) {
			const ariaHiddenProperty = node.attributes.properties.find(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "aria-hidden",
			);

			if (!ariaHiddenProperty || !ts.isJsxAttribute(ariaHiddenProperty)) {
				return false;
			}

			const { initializer } = ariaHiddenProperty;

			if (!initializer) {
				return false;
			}

			if (ts.isStringLiteral(initializer)) {
				return initializer.text === "true";
			}

			if (ts.isJsxExpression(initializer)) {
				const expression = initializer.expression;
				return expression?.kind === ts.SyntaxKind.TrueKeyword;
			}

			return false;
		}

		function hasInteractiveHandler(node: ts.JsxOpeningLikeElement) {
			return node.attributes.properties.some(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					interactiveHandlers.includes(property.name.text),
			);
		}

		function isDisabled(node: ts.JsxOpeningLikeElement) {
			const disabledProperty = node.attributes.properties.find(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "disabled",
			);

			if (!disabledProperty || !ts.isJsxAttribute(disabledProperty)) {
				return false;
			}

			if (!disabledProperty.initializer) {
				return true;
			}

			if (ts.isJsxExpression(disabledProperty.initializer)) {
				const expression = disabledProperty.initializer.expression;
				return expression?.kind === ts.SyntaxKind.TrueKeyword;
			}

			return false;
		}

		function checkElement(node: ts.JsxOpeningLikeElement) {
			if (!ts.isIdentifier(node.tagName)) {
				return;
			}

			const elementName = node.tagName.text.toLowerCase();
			if (elementName !== node.tagName.text) {
				return;
			}

			const hasInteractiveProps = hasInteractiveHandler(node);

			if (!hasInteractiveProps) {
				return;
			}

			if (isDisabled(node) || isAriaHidden(node)) {
				return;
			}

			const roleProperty = node.attributes.properties.find(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "role",
			);

			const role = getRoleValue(node);

			if (role === "presentation" || role === "none") {
				return;
			}

			const isInteractive =
				(role && interactiveRoles.has(role)) ||
				(!role && !nonInteractiveElements.has(elementName));

			if (!isInteractive) {
				return;
			}

			const hasNonInteractiveRole = role && nonInteractiveRoles.has(role);
			if (hasNonInteractiveRole) {
				return;
			}

			const hasInherentFocus = inherentlyFocusableElements.has(elementName);
			const tabIndex = getTabIndexValue(node);
			const hasFocusableTabIndex = tabIndex !== undefined;

			if (!hasInherentFocus && !hasFocusableTabIndex) {
				const displayRole = role || elementName;
				context.report({
					data: { role: displayRole },
					message: "notFocusable",
					range: getTSNodeRange(
						roleProperty && ts.isJsxAttribute(roleProperty)
							? roleProperty
							: node.tagName,
						context.sourceFile,
					),
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
