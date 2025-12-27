import {
	getTSNodeRange,
	TypeScriptServices,
	typescriptLanguage,
} from "@flint.fyi/ts";
import * as ts from "typescript";

const distractingElements = new Set(["blink", "marquee"]);

export default typescriptLanguage.createRule({
	about: {
		description: "Reports distracting elements like <marquee> and <blink>.",
		id: "distractingElements",
		preset: "logical",
	},
	messages: {
		noDistractingElement: {
			primary: "The <{{ element }}> element is distracting and deprecated.",
			secondary: [
				"Visually distracting elements cause accessibility issues for users with visual impairments.",
				"The <marquee> and <blink> elements are deprecated and should not be used.",
				"Use modern CSS animations if movement is necessary for your design.",
			],
			suggestions: [
				"Remove the distracting element",
				"Use CSS animations for visual effects",
			],
		},
	},
	setup(context) {
		function checkElement(
			{ tagName }: ts.JsxOpeningElement | ts.JsxSelfClosingElement,
			{ sourceFile }: TypeScriptServices,
		) {
			if (!ts.isIdentifier(tagName)) {
				return;
			}

			const elementName = tagName.text.toLowerCase();

			if (distractingElements.has(elementName)) {
				context.report({
					data: { element: elementName },
					message: "noDistractingElement",
					range: getTSNodeRange(tagName, sourceFile),
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
