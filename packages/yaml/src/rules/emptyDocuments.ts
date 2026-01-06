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
				"This YAML document contains no content beyond document markers.",
			secondary: [
				"Empty YAML documents serve no purpose and typically result from editing mistakes or incomplete refactoring.",
				"Removing empty documents improves file clarity and prevents potential confusion when parsing or maintaining YAML files.",
			],
			suggestions: [
				"Remove the empty document entirely.",
				"Add content to the document if it was intended to hold data.",
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
