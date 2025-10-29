import { typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallow unnecessary JSX fragments that wrap a single child or have no children.",
		id: "unnecessaryFragments",
		preset: "stylistic",
	},
	messages: {
		unnecessaryFragment: {
			primary: "Unnecessary fragment wrapping {{ childType }}.",
			secondary: [
				"Fragments are only needed when rendering multiple adjacent elements.",
				"A fragment wrapping a single child or no children adds unnecessary complexity.",
				"Remove the fragment and use the child directly, or remove empty fragments entirely.",
			],
			suggestions: [
				"Remove the fragment wrapper and use the child element directly.",
			],
		},
	},
	setup(context) {
		function checkFragment(node: ts.JsxFragment) {
			const children = node.children.filter(
				(child) => !ts.isJsxText(child) || child.text.trim().length > 0,
			);

			let childType: string | undefined;

			if (children.length === 0) {
				childType = "no children";
			} else if (children.length === 1) {
				childType = "a single child";
			}

			if (childType) {
				context.report({
					data: { childType },
					message: "unnecessaryFragment",
					range: {
						begin: node.openingFragment.getStart(context.sourceFile),
						end: node.closingFragment.getEnd(),
					},
				});
			}
		}

		function checkElement(node: ts.JsxElement) {
			if (
				!ts.isIdentifier(node.openingElement.tagName) ||
				node.openingElement.tagName.text !== "Fragment"
			) {
				return;
			}

			// If Fragment has props (like key), it's necessary
			if (node.openingElement.attributes.properties.length > 0) {
				return;
			}

			const children = node.children.filter(
				(child) => !ts.isJsxText(child) || child.text.trim().length > 0,
			);

			let childType: string | undefined;

			if (children.length === 0) {
				childType = "no children";
			} else if (children.length === 1) {
				childType = "a single child";
			}

			if (childType) {
				context.report({
					data: { childType },
					message: "unnecessaryFragment",
					range: {
						begin: node.openingElement.getStart(context.sourceFile),
						end: node.closingElement.getEnd(),
					},
				});
			}
		}

		return {
			visitors: {
				JsxElement: checkElement,
				JsxFragment: checkFragment,
			},
		};
	},
});
