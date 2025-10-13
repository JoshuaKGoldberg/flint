import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description:
			"Reports empty static initialization blocks within class declarations.",
		id: "emptyStaticBlocks",
		preset: "stylistic",
	},
	messages: {
		emptyStaticBlock: {
			primary:
				"Empty static blocks serve no purpose and should be removed for cleaner code.",
			secondary: [
				"Static blocks are used to initialize static class properties or perform other one-time setup when a class is loaded.",
				"An empty static block has no statements and therefore serves no purpose.",
			],
			suggestions: [
				"Remove the empty static block, or add initialization logic if needed.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				ClassStaticBlockDeclaration: (node) => {
					const statements = node.body.statements;
					if (statements.length) {
						return;
					}

					const openBrace = node.body.getFirstToken(context.sourceFile);
					if (!openBrace) {
						return;
					}

					const range = {
						begin: node.getStart(context.sourceFile),
						end: openBrace.getEnd(),
					};

					context.report({
						message: "emptyStaticBlock",
						range,
						suggestions: [
							{
								id: "removeEmptyStaticBlock",
								range: {
									begin: node.getStart(context.sourceFile),
									end: node.getEnd(),
								},
								text: "",
							},
						],
					});
				},
			},
		};
	},
});
