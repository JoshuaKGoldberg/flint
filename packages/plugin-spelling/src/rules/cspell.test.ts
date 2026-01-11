/* cspell:disable */
import rule from "./cspell.ts";
import { ruleTester } from "./ruleTester.ts";

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
				{
					id: "replaceWithincorrect",
					updated: `
                incorrect
            `,
				},
			],
		},
		{
			code: `
                const myarray = [];
            `,
			snapshot: `
                const myarray = [];
                      ~~~~~~~
                      Forbidden or unknown word: "myarray".
            `,
			suggestions: [
				{
					files: {
						"cspell.json": [
							{
								original: ``,
								updated: '{"words":["myarray"]}',
							},
							{
								original: `{}`,
								updated: '{"words":["myarray"]}',
							},
							{
								original: `{"words":[]}`,
								updated: '{"words":["myarray"]}',
							},
							{
								original: `{"words":["existing"]}`,
								updated: '{"words":["existing","myarray"]}',
							},
						],
					},
					id: "addWordToWords",
				},
				{
					id: "replaceWithmarry",
					updated: `
                const marry = [];
            `,
				},
			],
		},
	],
	valid: ["", "known", "known-word", "knownWord"],
});
