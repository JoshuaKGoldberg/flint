import * as ts from "typescript";

import { getTSNodeRange } from "../getTSNodeRange.js";
import { typescriptLanguage, TypeScriptServices } from "../language.js";

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
				"This parameter overrides the previous parameter of the same name.",
			secondary: [
				"Duplicate parameter names in functions can lead to unexpected behavior and make code harder to understand.",
				"In strict mode, duplicate parameter names are a syntax error.",
				"Even in non-strict mode, only the last parameter with a given name is accessible.",
			],
			suggestions: ["Rename one of the duplicate parameters to a unique name."],
		},
	},
	setup(context) {
		function checkNode(
			{ parameters }: ts.FunctionLikeDeclaration,
			{ sourceFile }: TypeScriptServices,
		) {
			const seenNames = new Set<string>();

			for (const parameter of parameters) {
				if (!ts.isIdentifier(parameter.name)) {
					continue;
				}

				const parameterName = parameter.name.text;
				const existingParameter = seenNames.has(parameterName);

				if (existingParameter) {
					context.report({
						message: "duplicateParam",
						range: getTSNodeRange(parameter.name, sourceFile),
					});
				} else {
					seenNames.add(parameterName);
				}
			}
		}

		return {
			visitors: {
				ArrowFunction: checkNode,
				Constructor: checkNode,
				FunctionDeclaration: checkNode,
				FunctionExpression: checkNode,
				MethodDeclaration: checkNode,
			},
		};
	},
});
