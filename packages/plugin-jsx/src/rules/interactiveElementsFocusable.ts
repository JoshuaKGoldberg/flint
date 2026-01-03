import {
	getTSNodeRange,
	typescriptLanguage,
	TypeScriptServices,
} from "@flint.fyi/ts";
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
				"The '{{ role }}' role makes this element interactive, so it should also be focusable.",
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
			const tabIndex = node.attributes.properties.find(
				(property): property is ts.JsxAttribute =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "tabIndex",
			);

			if (!tabIndex?.initializer) {
				return undefined;
			}

			if (ts.isJsxExpression(tabIndex.initializer)) {
				const expression = tabIndex.initializer.expression;
				if (expression && ts.isNumericLiteral(expression)) {
					return Number(expression.text);
				}
			}

			if (ts.isStringLiteral(tabIndex.initializer)) {
				return Number(tabIndex.initializer.text);
			}

			return undefined;
		}

		function getRoleValue(node: ts.JsxOpeningLikeElement) {
			const role = node.attributes.properties.find(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "role",
			);

			if (
				role &&
				ts.isJsxAttribute(role) &&
				role.initializer &&
				ts.isStringLiteral(role.initializer)
			) {
				return role.initializer.text;
			}

			return undefined;
		}

		function isAriaHidden(node: ts.JsxOpeningLikeElement) {
			const ariaHidden = node.attributes.properties.find(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "aria-hidden",
			);

			if (
				!ariaHidden ||
				!ts.isJsxAttribute(ariaHidden) ||
				!ariaHidden.initializer
			) {
				return false;
			}

			if (ts.isJsxExpression(ariaHidden.initializer)) {
				return (
					ariaHidden.initializer.expression?.kind === ts.SyntaxKind.TrueKeyword
				);
			}

			if (ts.isStringLiteral(ariaHidden.initializer)) {
				return ariaHidden.initializer.text === "true";
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
				return (
					disabledProperty.initializer.expression?.kind ===
					ts.SyntaxKind.TrueKeyword
				);
			}

			return false;
		}

		function checkElement(
			node: ts.JsxOpeningLikeElement,
			{ sourceFile }: TypeScriptServices,
		) {
			if (!ts.isIdentifier(node.tagName)) {
				return;
			}

			const elementName = node.tagName.text.toLowerCase();
			if (
				elementName !== node.tagName.text ||
				!hasInteractiveHandler(node) ||
				isAriaHidden(node) ||
				isDisabled(node)
			) {
				return;
			}

			const role = getRoleValue(node);
			if (role === "presentation" || role === "none") {
				return;
			}

			const isInteractive =
				(role !== undefined && interactiveRoles.has(role)) ||
				(role === undefined && !nonInteractiveElements.has(elementName));

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
			const roleProperty = node.attributes.properties.find(
				(property) =>
					ts.isJsxAttribute(property) &&
					ts.isIdentifier(property.name) &&
					property.name.text === "role",
			);

			if (!hasInherentFocus && !hasFocusableTabIndex) {
				const displayRole = role ?? elementName;
				context.report({
					data: { role: displayRole },
					message: "notFocusable",
					range: getTSNodeRange(
						roleProperty && ts.isJsxAttribute(roleProperty)
							? roleProperty
							: node.tagName,
						sourceFile,
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
