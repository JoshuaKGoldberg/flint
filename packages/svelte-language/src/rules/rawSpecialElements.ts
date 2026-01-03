import {
	getPositionOfColumnAndLine,
	SourceFileWithLineMap,
} from "@flint.fyi/core";
import { svelteLanguage } from "../language.js";

export default svelteLanguage.createRule({
	about: {
		description: "TODO",
		id: "rawSpecialElements",
		preset: "logical",
	},
	messages: {
		rawSpecialElement: {
			primary:
				"TODO: don't use `{{ element }}` tag, use `svelte:{{ element }}` instead",
			secondary: ["TODO"],
			suggestions: ["TODO"],
		},
	},
	setup(context) {
		const { svelteServices } = context;
		if (svelteServices == null) {
			return undefined;
		}
		const sourceText: SourceFileWithLineMap = {
			text: svelteServices.sourceText,
		};
		svelteServices.ast.fragment.nodes.forEach(function visit(node) {
			if (node.type === "RegularElement") {
				switch (node.name) {
					case "head":
					case "body":
					case "window":
					case "document":
					case "element":
					case "options":
						svelteServices.reportComponent({
							message: "rawSpecialElement",
							range: {
								begin: getPositionOfColumnAndLine(sourceText, {
									line: node.name_loc.start.line - 1,
									column: node.name_loc.start.column,
								}),
								end: getPositionOfColumnAndLine(sourceText, {
									line: node.name_loc.end.line - 1,
									column: node.name_loc.end.column,
								}),
							},
							data: {
								element: node.name,
							},
						});
				}
			}
			if ("fragment" in node) {
				node.fragment.nodes.forEach(visit);
			}
		});
		return undefined;
	},
});
