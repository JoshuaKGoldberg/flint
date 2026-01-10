import rule from "./charAtComparisons.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
text.charAt(0) === "ab";
`,
			snapshot: `
text.charAt(0) === "ab";
~~~~~~~~~~~~~~~~~~~~~~~
Comparing charAt() result with a string of length 2 is always false.
`,
		},
		{
			code: `
"abc" === text.charAt(0);
`,
			snapshot: `
"abc" === text.charAt(0);
~~~~~~~~~~~~~~~~~~~~~~~~
Comparing charAt() result with a string of length 3 is always false.
`,
		},
		{
			code: `
str.charAt(index) == "hello";
`,
			snapshot: `
str.charAt(index) == "hello";
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Comparing charAt() result with a string of length 5 is always false.
`,
		},
		{
			code: `
text.charAt(0) !== "ab";
`,
			snapshot: `
text.charAt(0) !== "ab";
~~~~~~~~~~~~~~~~~~~~~~~
Comparing charAt() result with a string of length 2 is always true.
`,
		},
		{
			code: `
text.charAt(0) != "abc";
`,
			snapshot: `
text.charAt(0) != "abc";
~~~~~~~~~~~~~~~~~~~~~~~
Comparing charAt() result with a string of length 3 is always true.
`,
		},
		{
			code: `
if (value.charAt(5) === "test") {
    doSomething();
}
`,
			snapshot: `
if (value.charAt(5) === "test") {
    ~~~~~~~~~~~~~~~~~~~~~~~~~~
    Comparing charAt() result with a string of length 4 is always false.
    doSomething();
}
`,
		},
	],
	valid: [
		'text.charAt(0) === "a";',
		'text.charAt(0) === "";',
		'"a" === text.charAt(0);',
		'text.charAt(0) !== "a";',
		"text.charAt(0) === variable;",
		"text.slice(0, 2) === 'ab';",
		"text.startsWith('ab');",
		"text.includes('ab');",
		"text[0] === 'a';",
	],
});
