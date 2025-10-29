import { typescriptLanguage } from "@flint.fyi/ts";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports using the delete operator.",
		id: "deletes",
	},
	messages: {
		noDelete: {
			primary:
				"Using the delete operator prevents optimizations in JavaScript engines.",
			secondary: [
				"The delete operator modifies object shape, causing deoptimizations in modern JavaScript engines.",
				"This can significantly impact performance in performance-critical code paths.",
			],
			suggestions: [
				"Instead of deleting properties, set them to undefined or use a Map if you need frequent additions and removals.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				DeleteExpression: (node) => {
					const start = node.getStart(context.sourceFile);

					context.report({
						message: "noDelete",
						range: {
							begin: start,
							end: start + "delete".length,
						},
					});
				},
			},
		};
	},
});
