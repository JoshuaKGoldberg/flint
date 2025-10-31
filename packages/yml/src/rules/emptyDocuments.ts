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
			suggestions: [
				"Remove the empty document entirely.",
				"Add content to the document if it was meant to contain data.",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				document: (node) => {
					const [documentHead, documentBody] = node.children;
					if (documentBody.children.length === 0) {
						// Determine the range to remove for the fix
						// We want to remove the entire document including trailing whitespace
						const documentStart = node.position.start.offset;
						let documentEnd = node.position.end.offset;

						// Check if there's a next sibling document
						const parent = context.root;
						const documentIndex = parent.children.indexOf(node);
						const hasNextDocument = documentIndex < parent.children.length - 1;

						// If there's a next document, we want to remove up to (but not including) it
						// Otherwise, remove the entire document including trailing content
						if (hasNextDocument) {
							const nextDocument = parent.children[documentIndex + 1];
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
