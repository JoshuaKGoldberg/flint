import rule from "./keyNormalization.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
{
    "cafe\u0301": "value"
}
`,
			snapshot: `
{
    "cafe\u0301": "value"
    ~~~~~~~
    This key is not normalized using the NFC normalization form.
}
`,
		},
		{
			code: `
{
    "résumé": "document",
    "cafe\u0301": "latte"
}
`,
			snapshot: `
{
    "résumé": "document",
    "cafe\u0301": "latte"
    ~~~~~~~
    This key is not normalized using the NFC normalization form.
}
`,
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
			snapshot: `
{
    "café": "value"
    ~~~~~~
    This key is not normalized using the NFD normalization form.
}
`,
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
			snapshot: `
{
    "café": "espresso",
    ~~~~~~
    This key is not normalized using the NFD normalization form.
    "naïve": "approach"
    ~~~~~~~
    This key is not normalized using the NFD normalization form.
}
`,
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
