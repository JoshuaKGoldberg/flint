import { markdown } from "../language.js";

export default markdown.createRule({
	about: {
		id: "headingIncrements",
		preset: "logical",
	},
	messages: {
		levelSkip: {
			primary:
				"This heading level {{ level }} skips more than one level from the previous heading level of {{ previous }}.",
			secondary: ["TODO"],
			suggestions: ["TODO"],
		},
	},
	setup(context) {
		let previousDepth = 0;

		return {
			heading(node) {
				if (previousDepth && node.depth > previousDepth + 1) {
					const begin = node.position.start.offset;

					context.report({
						data: {
							level: node.depth,
							previous: previousDepth,
						},
						message: "levelSkip",
						range: {
							begin,
							end: begin + node.depth,
						},
					});
				}

				previousDepth = node.depth;
			},
		};
	},
});
