import { typescriptLanguage } from "../language.js";

export default typescriptLanguage.createRule({
	about: {
		description: "Reports files with Unicode Byte Order Marks (BOMs).",
		id: "unicodeBOMs",
		preset: "stylistic",
	},
	messages: {
		noBOM: {
			primary: "Prefer files without a Unicode Byte Order Mark (BOM).",
			secondary: [
				"The Unicode BOM is a special character (U+FEFF) that can appear at the start of a file to indicate its byte order and encoding.",
				"While it can be useful in some contexts, it is generally unnecessary in UTF-8 files and can cause issues with some tools and editors.",
			],
			suggestions: ["Remove the BOM from the beginning of the file."],
		},
	},
	setup(context) {
		const text = context.sourceFile.getFullText();

		if (text.charCodeAt(0) === 0xfeff) {
			context.report({
				message: "noBOM",
				range: {
					begin: 0,
					end: 1,
				},
				suggestions: [
					{
						id: "removeBOM",
						range: {
							begin: 0,
							end: 1,
						},
						text: "",
					},
				],
			});
		}

		return {};
	},
});
