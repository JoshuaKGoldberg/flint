import { markdownLanguage } from "../language.js";

export default markdownLanguage.createRule({
	about: {
		description: "Reports images without alternative text.",
		id: "imageAltTexts",
		preset: "logical",
	},
	messages: {
		missingAlt: {
			primary: "This image is missing alternative text.",
			secondary: [
				"Alternative text for images is essential for accessibility.",
				"Users who rely on screen readers or other assistive technologies won't be able to understand the content of images without alt text.",
				"Provide descriptive alternative text that conveys the meaning or purpose of the image.",
			],
			suggestions: [
				"Add descriptive alternative text: ![description](url)",
				"If the image is decorative, use empty alt text explicitly",
			],
		},
		whitespaceAlt: {
			primary: "This image has only whitespace as alternative text.",
			secondary: [
				"Alternative text containing only whitespace is not meaningful for users relying on screen readers.",
				"Provide descriptive alternative text that conveys the meaning or purpose of the image.",
				"If the image is purely decorative, use empty alt text explicitly instead of whitespace.",
			],
			suggestions: [
				"Add descriptive alternative text: ![description](url)",
				"If the image is decorative, use empty alt text explicitly",
			],
		},
	},
	setup(context) {
		return {
			visitors: {
				image(node) {
					if (!node.alt) {
						context.report({
							message: "missingAlt",
							range: {
								begin: node.position.start.offset,
								end: node.position.end.offset,
							},
						});
					} else if (node.alt.trim() === "") {
						context.report({
							message: "whitespaceAlt",
							range: {
								begin: node.position.start.offset,
								end: node.position.end.offset,
							},
						});
					}
				},
				imageReference(node) {
					if (!node.alt) {
						context.report({
							message: "missingAlt",
							range: {
								begin: node.position.start.offset,
								end: node.position.end.offset,
							},
						});
					} else if (node.alt.trim() === "") {
						context.report({
							message: "whitespaceAlt",
							range: {
								begin: node.position.start.offset,
								end: node.position.end.offset,
							},
						});
					}
				},
			},
		};
	},
});
