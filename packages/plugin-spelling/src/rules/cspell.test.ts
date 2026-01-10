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
					id: "replaceWithincorrect",
					updated: `
                incorrect
            `,
				},
				{
					id: "replaceWithindirect",
					updated: `
                indirect
            `,
				},
				{
					id: "replaceWithincoherent",
					updated: `
                incoherent
            `,
				},
				{
					id: "replaceWithincrust",
					updated: `
                incrust
            `,
				},
				{
					id: "replaceWithinfract",
					updated: `
                infract
            `,
				},
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
					id: "replaceWithmarry",
					updated: `
                const marry = [];
            `,
				},
				{
					id: "replaceWithMurray",
					updated: `
                const Murray = [];
            `,
				},
				{
					id: "replaceWithmargay",
					updated: `
                const margay = [];
            `,
				},
				{
					id: "replaceWitharray",
					updated: `
                const array = [];
            `,
				},
				{
					id: "replaceWithisarray",
					updated: `
                const isarray = [];
            `,
				},
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
			],
		},
	],
	valid: ["", "known", "known-word", "knownWord"],
});
