import {
	type AST,
	getTSNodeRange,
	type TypeScriptFileServices,
	typescriptLanguage,
} from "@flint.fyi/ts";
import * as ts from "typescript";
import { SyntaxKind } from "typescript";

const controlElements = new Set([
	"input",
	"meter",
	"output",
	"progress",
	"select",
	"textarea",
]);

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports <label> elements without an associated control element.",
		id: "labelAssociatedControls",
		preset: "logical",
	},
	messages: {
		missingAssociatedControl: {
			primary: "This <label> element is missing an associated control element.",
			secondary: [
				"Labels must be associated with a control element to be accessible to screen readers.",
				"Use the htmlFor prop to reference a control by id, or nest the control inside the label.",
				"This is required for WCAG 1.3.1, 2.4.6, and 4.1.2 compliance.",
			],
			suggestions: [
				"Add an htmlFor prop that references a control element by id",
				"Nest a control element (input, select, textarea) inside the label",
			],
		},
	},
	setup(context) {
		function hasHtmlForAttribute(attributes: AST.JsxAttributes): boolean {
			return attributes.properties.some((property) => {
				if (
					!ts.isJsxAttribute(property) ||
					!ts.isIdentifier(property.name) ||
					property.name.text !== "htmlFor" ||
					!property.initializer
				) {
					return false;
				}

				if (ts.isStringLiteral(property.initializer)) {
					return property.initializer.text !== "";
				}

				if (ts.isJsxExpression(property.initializer)) {
					const { expression } = property.initializer;
					if (!expression) {
						return false;
					}

					if (
						(ts.isStringLiteral(expression) && expression.text === "") ||
						(ts.isNoSubstitutionTemplateLiteral(expression) &&
							expression.text === "") ||
						(ts.isIdentifier(expression) && expression.text === "undefined") ||
						expression.kind === ts.SyntaxKind.NullKeyword
					) {
						return false;
					}
				}

				return true;
			});
		}

		function hasNestedControl(children: ts.NodeArray<AST.JsxChild>): boolean {
			return children.some((child) => {
				if (child.kind == SyntaxKind.JsxElement) {
					const { tagName } = child.openingElement;
					return (
						(ts.isIdentifier(tagName) &&
							controlElements.has(tagName.text.toLowerCase())) ||
						hasNestedControl(child.children)
					);
				}

				if (ts.isJsxSelfClosingElement(child)) {
					return (
						ts.isIdentifier(child.tagName) &&
						controlElements.has(child.tagName.text.toLowerCase())
					);
				}

				return false;
			});
		}

		function checkLabel(
			node: AST.JsxElement | AST.JsxSelfClosingElement,
			{ sourceFile }: TypeScriptFileServices,
		) {
			if (
				node.kind == SyntaxKind.JsxElement &&
				hasNestedControl(node.children)
			) {
				return;
			}

			const tagName =
				node.kind == SyntaxKind.JsxElement
					? node.openingElement.tagName
					: node.tagName;

			if (!ts.isIdentifier(tagName) || tagName.text.toLowerCase() !== "label") {
				return;
			}

			const attributes =
				node.kind == SyntaxKind.JsxElement
					? node.openingElement.attributes
					: node.attributes;

			if (hasHtmlForAttribute(attributes)) {
				return;
			}

			context.report({
				message: "missingAssociatedControl",
				range: getTSNodeRange(tagName, sourceFile),
			});
		}

		return {
			visitors: {
				JsxElement: checkLabel,
				JsxSelfClosingElement: checkLabel,
			},
		};
	},
});
