import { astroLanguage } from "../language.js";

export default astroLanguage.createRule({
	about: {
		description: "TODO",
		id: "setHtmlDirectives",
		preset: "logical",
	},
	messages: {
		setHtml: {
			primary: `TODO: don't use set:html to reduce XSS risk`,
			secondary: ["TODO"],
			suggestions: ["TODO"],
		},
	},
	setup(context) {
		const { astroServices } = context;
		if (astroServices == null) {
			return undefined;
		}
		astroServices.ast.children.forEach(function visit(node) {
			if ("attributes" in node) {
				for (const attr of node.attributes) {
					if (attr.name === "set:html") {
						const begin = attr.position!.start.offset;
						astroServices.reportComponent({
							message: "setHtml",
							range: {
								begin,
								end: begin + attr.name.length,
							},
						});
					}
				}
			}
			if ("children" in node) {
				node.children.forEach(visit);
			}
		});
		return undefined;
	},
});
