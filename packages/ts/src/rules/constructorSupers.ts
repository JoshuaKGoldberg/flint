import * as tsutils from "ts-api-utils";
import ts from "typescript";

import { typescriptLanguage } from "../language.ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports improper super() calls in class constructors.",
		id: "constructorSupers",
		preset: "untyped",
	},
	messages: {
		missingSuper: {
			primary: "Derived classes must call super() in their constructor.",
			secondary: [
				"The super() call is required to initialize the parent class before using 'this'.",
			],
			suggestions: ["Add a super() call at the beginning of the constructor."],
		},
		unexpectedSuper: {
			primary:
				"Non-derived classes should not call super() in their constructor.",
			secondary: [
				"This class does not extend another class, so calling super() is invalid.",
			],
			suggestions: ["Remove the super() call."],
		},
	},
	setup(context) {
		return {
			visitors: {
				Constructor: (node, { sourceFile }) => {
					if (!node.body) {
						return;
					}

					const classNode = node.parent;
					const isDerived =
						classNode.heritageClauses?.some(
							(clause) => clause.token === ts.SyntaxKind.ExtendsKeyword,
						) ?? false;

					let hasSuperCall = false;
					let superCallNode: ts.Node | undefined;

					function checkForSuperCall(node: ts.Node): void {
						if (
							ts.isCallExpression(node) &&
							node.expression.kind === ts.SyntaxKind.SuperKeyword
						) {
							hasSuperCall = true;
							superCallNode = node;
							return;
						}

						if (tsutils.isFunctionScopeBoundary(node)) {
							return;
						}

						ts.forEachChild(node, checkForSuperCall);
					}

					ts.forEachChild(node.body, checkForSuperCall);

					if (isDerived && !hasSuperCall) {
						context.report({
							message: "missingSuper",
							range: {
								begin: node.getStart(sourceFile),
								end: node.body.getStart(sourceFile),
							},
						});
					} else if (!isDerived && hasSuperCall && superCallNode) {
						context.report({
							message: "unexpectedSuper",
							range: {
								begin: superCallNode.getStart(sourceFile),
								end: superCallNode.getEnd(),
							},
						});
					}
				},
			},
		};
	},
});
