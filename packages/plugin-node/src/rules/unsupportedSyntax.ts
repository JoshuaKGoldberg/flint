import { getTSNodeRange, typescriptLanguage } from "@flint.fyi/ts";
import * as ts from "typescript";

interface FeatureSupport {
	check: (node: ts.Node) => boolean;
	minVersion: string;
	name: string;
}

const features: FeatureSupport[] = [
	{
		check: (node: ts.Node) =>
			ts.isBinaryExpression(node) &&
			node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken,
		minVersion: "14.0.0",
		name: "nullish coalescing operators",
	},
	{
		check: (node: ts.Node) =>
			ts.isBinaryExpression(node) &&
			(node.operatorToken.kind ===
				ts.SyntaxKind.AmpersandAmpersandEqualsToken ||
				node.operatorToken.kind === ts.SyntaxKind.BarBarEqualsToken ||
				node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionEqualsToken),
		minVersion: "15.0.0",
		name: "logical assignment operators",
	},
	{
		check: (node: ts.Node) =>
			ts.isPropertyAccessExpression(node) &&
			node.questionDotToken !== undefined,
		minVersion: "14.0.0",
		name: "optional chaining",
	},
	{
		check: (node: ts.Node) => ts.isBigIntLiteral(node),
		minVersion: "10.4.0",
		name: "bigint",
	},
];

export default typescriptLanguage.createRule({
	about: {
		description:
			"Disallow ECMAScript syntax features unsupported in the target Node.js version.",
		id: "unsupportedSyntax",
		preset: "logical",
	},
	messages: {
		unsupportedFeature: {
			primary:
				"The {{ featureName }} feature requires Node.js {{ minVersion }} or later.",
			secondary: [
				"Using features that are not supported by your target Node.js version can cause runtime errors.",
				"Ensure your Node.js version in package.json engines field supports this feature, or avoid using it.",
			],
			suggestions: [
				"Update the Node.js version requirement in package.json",
				"Use a transpiler to support older Node.js versions",
				"Refactor to avoid using this feature",
			],
		},
	},
	setup(context) {
		function checkBinaryExpression(node: ts.BinaryExpression) {
			for (const feature of features) {
				if (feature.check(node)) {
					context.report({
						data: {
							featureName: feature.name,
							minVersion: feature.minVersion,
						},
						message: "unsupportedFeature",
						range: getTSNodeRange(node.operatorToken, context.sourceFile),
					});
					break;
				}
			}
		}

		function checkNode(node: ts.Node) {
			for (const feature of features) {
				if (feature.check(node)) {
					context.report({
						data: {
							featureName: feature.name,
							minVersion: feature.minVersion,
						},
						message: "unsupportedFeature",
						range: getTSNodeRange(node, context.sourceFile),
					});
					break;
				}
			}
		}

		return {
			visitors: {
				BigIntLiteral(node: ts.BigIntLiteral) {
					checkNode(node);
				},
				BinaryExpression(node: ts.BinaryExpression) {
					checkBinaryExpression(node);
				},
				PropertyAccessExpression(node: ts.PropertyAccessExpression) {
					checkNode(node);
				},
			},
		};
	},
});
