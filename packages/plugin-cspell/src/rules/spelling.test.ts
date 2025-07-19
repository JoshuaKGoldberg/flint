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
		},
	],
	valid: ["", "known", "known-word", "knownWord"],
});
