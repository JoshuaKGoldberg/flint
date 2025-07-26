/* cspell:disable */
import { ruleTester } from "./ruleTester.js";
import rule from "./spelling.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
                incorect
            `,
			snapshot: `
                incorect
               ~~~~~~~~
               Forbidden or unknown word: "incorect".
            `,
			suggestions: [
				{
					files: {
						"cspell.json": [
							{
								original: ``,
								updated: '{"words":["incorect"]}',
							},
							{
								original: `{}`,
								updated: '{"words":["incorect"]}',
							},
							{
								original: `{"words":[]}`,
								updated: '{"words":["incorect"]}',
							},
							{
								original: `{"words":["existing"]}`,
								updated: '{"words":["existing","incorect"]}',
							},
						],
					},
					id: "addWordToWords",
				},
			],
		},
	],
	valid: ["", "known", "known-word", "knownWord"],
});
