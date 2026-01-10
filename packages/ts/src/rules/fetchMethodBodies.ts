import { SyntaxKind } from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.ts";
import { typescriptLanguage } from "../language.ts";
import * as AST from "../types/ast.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Disallow providing a body with GET or HEAD fetch requests.",
		id: "fetchMethodBodies",
		preset: "logical",
	},
	messages: {
		noBody: {
			body: "{{method}}",
			primary: "`body` is not allowed when the request method is `{{method}}`.",
			secondary: [
				"The Fetch API will throw a `TypeError` at runtime if a body is provided with a `{{method}}` request.",
			],
			suggestions: [
				"Remove the `body` property from the options.",
				"Change the method to `POST`, `PUT`, or another method that supports request bodies.",
			],
		},
	},
	setup(context) {
		function isUndefinedOrNull(node: AST.Expression) {
			return (
				(node.kind === SyntaxKind.Identifier && node.text === "undefined") ||
				node.kind === SyntaxKind.NullKeyword
			);
		}

		function checkFetchOptions(
			node: AST.Expression,
			sourceFile: AST.SourceFile,
		) {
			if (node.kind !== SyntaxKind.ObjectLiteralExpression) {
				return;
			}

			const properties = node.properties;

			const bodyProperty = [...properties]
				.reverse()
				.find(
					(property): property is AST.PropertyAssignment =>
						property.kind === SyntaxKind.PropertyAssignment &&
						property.name.kind === SyntaxKind.Identifier &&
						property.name.text === "body",
				);

			if (!bodyProperty) {
				return;
			}

			if (isUndefinedOrNull(bodyProperty.initializer)) {
				return;
			}

			const methodProperty = [...properties]
				.reverse()
				.find(
					(property): property is AST.PropertyAssignment =>
						property.kind === SyntaxKind.PropertyAssignment &&
						property.name.kind === SyntaxKind.Identifier &&
						property.name.text === "method",
				);

			if (!methodProperty) {
				const hasSpreadElement = properties.some(
					(property) => property.kind === SyntaxKind.SpreadAssignment,
				);
				if (hasSpreadElement) {
					return;
				}

				context.report({
					data: { method: "GET" },
					message: "noBody",
					range: getTSNodeRange(bodyProperty.name, sourceFile),
				});
				return;
			}

			const methodValue = methodProperty.initializer;
			if (methodValue.kind !== SyntaxKind.StringLiteral) {
				return;
			}

			const method = methodValue.text.toUpperCase();
			if (method !== "GET" && method !== "HEAD") {
				return;
			}

			context.report({
				data: { method },
				message: "noBody",
				range: getTSNodeRange(bodyProperty.name, sourceFile),
			});
		}

		return {
			visitors: {
				CallExpression: (node, { sourceFile }) => {
					if (
						node.expression.kind !== SyntaxKind.Identifier ||
						node.expression.text !== "fetch"
					) {
						return;
					}

					if (node.arguments.length < 2) {
						return;
					}

					checkFetchOptions(node.arguments[1], sourceFile);
				},
				NewExpression: (node, { sourceFile }) => {
					if (
						node.expression.kind !== SyntaxKind.Identifier ||
						node.expression.text !== "Request"
					) {
						return;
					}

					if (!node.arguments || node.arguments.length < 2) {
						return;
					}

					checkFetchOptions(node.arguments[1], sourceFile);
				},
			},
		};
	},
});
