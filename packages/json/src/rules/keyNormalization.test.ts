import { expect } from "vitest";

import rule from "./keyNormalization.js";
import { ruleTester } from "./ruleTester.js";

// cspell:ignore café cafè naïve piñata résumé

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
{
    "cafe\u0301": "value"
}
`,
			snapshot: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					{
					    "café": "value"
					    ~~~~~~~
					    This key is not normalized using the NFC normalization form.
					}
					"
				`);
			},
			suggestions: [
				{
					id: "normalizeKey",
					updated: (text) => {
						expect(text).toMatchInlineSnapshot(`
							"
							{
							    "café": "value"
							}
							"
						`);
					},
				},
			],
		},
		{
			code: `
{
    "résumé": "document",
    "cafe\u0301": "latte"
}
`,
			snapshot: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					{
					    "résumé": "document",
					    "café": "latte"
					    ~~~~~~~
					    This key is not normalized using the NFC normalization form.
					}
					"
				`);
			},
			suggestions: [
				{
					id: "normalizeKey",
					updated: (text) => {
						expect(text).toMatchInlineSnapshot(`
							"
							{
							    "résumé": "document",
							    "café": "latte"
							}
							"
						`);
					},
				},
			],
		},
		{
			code: `
{
    "café": "value"
}
`,
			options: {
				form: "NFD",
			},
			snapshot: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					{
					    "café": "value"
					    ~~~~~~
					    This key is not normalized using the NFD normalization form.
					}
					"
				`);
			},
			suggestions: [
				{
					id: "normalizeKey",
					updated: (text) => {
						expect(text).toMatchInlineSnapshot(`
							"
							{
							    "café": "value"
							}
							"
						`);
					},
				},
			],
		},
		{
			code: `
{
    "café": "espresso",
    "naïve": "approach"
}
`,
			options: {
				form: "NFD",
			},
			snapshot: (text) => {
				expect(text).toMatchInlineSnapshot(`
					"
					{
					    "café": "espresso",
					    ~~~~~~
					    This key is not normalized using the NFD normalization form.
					    "naïve": "approach"
					    ~~~~~~~
					    This key is not normalized using the NFD normalization form.
					}
					"
				`);
			},
			suggestions: [
				{
					id: "normalizeKey",
					updated: (text) => {
						expect(text).toMatchInlineSnapshot(`
							"
							{
							    "café": "espresso",
							    "naïve": "approach"
							}
							"
						`);
					},
				},
				{
					id: "normalizeKey",
					updated: (text) => {
						expect(text).toMatchInlineSnapshot(`
							"
							{
							    "café": "espresso",
							    "naïve": "approach"
							}
							"
						`);
					},
				},
			],
		},
	],
	valid: [
		`{}`,
		`{ "simple": "value" }`,
		`{ "no_special_chars": true }`,
		`
{
    "café": "value"
}
`,
		`
{
    "résumé": "document",
    "naïve": "approach",
    "piñata": "party"
}
`,
		{
			code: `
{
    "cafe\u0301": "value"
}
`,
			options: {
				form: "NFD",
			},
		},
	],
});
