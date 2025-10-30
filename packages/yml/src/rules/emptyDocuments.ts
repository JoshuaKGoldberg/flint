import { ymlLanguage } from "../language.js";

export default ymlLanguage.createRule({
	about: {
		description: "Reports empty documents in YAML files.",
		id: "emptyDocuments",
		preset: "logical",
	},
	messages: {
		emptyDocument: {
			primary:
				"This document is empty and contains no content, which is often a mistake.",
			secondary: [
				"Empty documents can be confusing and may indicate incomplete or incorrect YAML structure.",
				"Consider removing the empty document or adding content to it.",
			],
			suggestions: ["TODO"],
		},
	},
	setup(context) {
		return {
			visitors: {
				document: (node) => {
					const documentBody = node.children[1];
					if (documentBody && documentBody.children.length === 0) {
						// Report on the documentHead (the --- marker)
						const documentHead = node.children[0];
						context.report({
							message: "emptyDocument",
							range: {
								begin: documentHead.position.start.offset,
								end: documentHead.position.end.offset,
							},
						});
					}
				},
			},
		};
	},
});
