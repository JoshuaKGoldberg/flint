import type { CommentDirective } from "../../types/directives.js";

export function createCommentDirectiveAlreadyDisabled(
	directive: CommentDirective,
	selection: string,
) {
	return {
		about: {
			id: "commentDirectiveAlreadyDisabled",
		},
		message: {
			primary: `The selection "${selection}" is already disabled by a previous flint-${directive.type} comment directive.`,
			secondary: ["TODO"],
			suggestions: ["TODO"],
		},
		range: directive.range,
	};
}
