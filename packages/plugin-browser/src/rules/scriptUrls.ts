import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports javascript: URLs.",
		id: "scriptUrls",
		preset: "logical",
	},
	messages: {
		scriptUrl: {
			primary: "This `javascript:` URL is a form of eval.",
			secondary: [
				"Code passed in javascript: URLs is parsed and evaluated by the browser in the same way as eval.",
				"This can lead to security vulnerabilities and is generally considered bad practice.",
				"Use event handlers or proper JavaScript functions instead.",
			],
			suggestions: [
				"Replace with an event handler (e.g., onClick)",
				"Use a regular URL or data URI",
			],
		},
	},
	setup(context) {
		function checkStringValue(value: string, node: ts.Node) {
			if (value.toLowerCase().startsWith("javascript:")) {
				context.report({
					message: "scriptUrl",
					range: getTSNodeRange(node, context.sourceFile),
				});
			}
		}

		return {
			visitors: {
				NoSubstitutionTemplateLiteral(node: ts.NoSubstitutionTemplateLiteral) {
					// Check if this is part of a tagged template
					if (ts.isTaggedTemplateExpression(node.parent)) {
						return;
					}
					checkStringValue(node.text, node);
				},
				StringLiteral(node: ts.StringLiteral) {
					checkStringValue(node.text, node);
				},
				TemplateExpression(node: ts.TemplateExpression) {
					// Check if this template is tagged (e.g., html`...`)
					if (ts.isTaggedTemplateExpression(node.parent)) {
						return;
					}

					// For template expressions with substitutions, check the head
					if (node.head.text.toLowerCase().startsWith("javascript:")) {
						context.report({
							message: "scriptUrl",
							range: getTSNodeRange(node, context.sourceFile),
						});
					}
				},
			},
		};
	},
});
