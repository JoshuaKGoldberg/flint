import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports functions with duplicate parameter names in their signatures.",
		id: "duplicateArguments",
		preset: "untyped",
	},
	messages: {
		duplicateParam: {
			primary:
				"Duplicate parameter names are not allowed in function signatures.",
			secondary: [
				"Duplicate parameter names in functions can lead to unexpected behavior and make code harder to understand.",
				"In strict mode, duplicate parameter names are a syntax error.",
				"Even in non-strict mode, only the last parameter with a given name is accessible.",
			],
			suggestions: ["Rename one of the duplicate parameters to a unique name."],
		},
	},
	setup(context) {
		function checkParameters(
			parameters: ts.NodeArray<ts.ParameterDeclaration>,
		) {
			const seenNames = new Map<string, ts.Identifier>();

			for (const parameter of parameters) {
				if (!ts.isIdentifier(parameter.name)) {
					continue;
				}

				const paramName = parameter.name.text;
				const existingParam = seenNames.get(paramName);

				if (existingParam) {
					context.report({
						message: "duplicateParam",
						range: getTSNodeRange(parameter.name, context.sourceFile),
					});
				} else {
					seenNames.set(paramName, parameter.name);
				}
			}
		}

		return {
			visitors: {
				ArrowFunction(node) {
					checkParameters(node.parameters);
				},
				Constructor(node) {
					checkParameters(node.parameters);
				},
				FunctionDeclaration(node) {
					checkParameters(node.parameters);
				},
				FunctionExpression(node) {
					checkParameters(node.parameters);
				},
				MethodDeclaration(node) {
					checkParameters(node.parameters);
				},
			},
		};
	},
});
