import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports `javascript:` URLs that can act as a form of eval.",
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
					if (!ts.isTaggedTemplateExpression(node.parent)) {
						checkStringValue(node.text, node);
					}
				},
				StringLiteral(node: ts.StringLiteral) {
					checkStringValue(node.text, node);
				},
				TemplateExpression(node: ts.TemplateExpression) {
					if (
						!ts.isTaggedTemplateExpression(node.parent) &&
						node.head.text.toLowerCase().startsWith("javascript:")
					) {
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
