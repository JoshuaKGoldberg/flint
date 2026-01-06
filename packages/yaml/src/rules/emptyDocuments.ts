import { yamlLanguage } from "../language.ts";

export default yamlLanguage.createRule({
	about: {
		description:
			"Reports empty YAML documents that contain only document markers.",
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
			suggestions: [
				"Remove the empty document entirely.",
				"Add content to the document if it was meant to contain data.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				document: (node, { root }) => {
					const [documentHead, documentBody] = node.children;
					if (documentBody.children.length === 0) {
						const documentStart = node.position.start.offset;
						let documentEnd = node.position.end.offset;

						const documentIndex = root.children.indexOf(node);
						const hasNextDocument = documentIndex < root.children.length - 1;

						if (hasNextDocument) {
							const nextDocument = root.children[documentIndex + 1];
							documentEnd = nextDocument.position.start.offset;
						}

						context.report({
							fix: {
								range: {
									begin: documentStart,
									end: documentEnd,
								},
								text: "",
							},
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
