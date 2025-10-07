import rule from "./octalEscapes.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const a = "\\1";
`,
			snapshot: `
const a = "\\1";
           ~~
           Octal escape sequences should not be used in string literals.
`,
		},
		{
			code: `
const a = "\\2";
`,
			snapshot: `
const a = "\\2";
           ~~
           Octal escape sequences should not be used in string literals.
`,
		},
		{
			code: `
const a = "\\7";
`,
			snapshot: `
const a = "\\7";
           ~~
           Octal escape sequences should not be used in string literals.
`,
		},
		{
			code: `
const a = "\\00";
`,
			snapshot: `
const a = "\\00";
           ~~~
           Octal escape sequences should not be used in string literals.
`,
		},
		{
			code: `
const a = "\\01";
`,
			snapshot: `
const a = "\\01";
           ~~~
           Octal escape sequences should not be used in string literals.
`,
		},
		{
			code: `
const a = "\\02";
`,
			snapshot: `
const a = "\\02";
           ~~~
           Octal escape sequences should not be used in string literals.
`,
		},
		{
			code: `
const a = "\\07";
`,
			snapshot: `
const a = "\\07";
           ~~~
           Octal escape sequences should not be used in string literals.
`,
		},
		{
			code: `
const a = "\\377";
`,
			snapshot: `
const a = "\\377";
           ~~~~
           Octal escape sequences should not be used in string literals.
`,
		},
		{
			code: `
const a = "\\12";
`,
			snapshot: `
const a = "\\12";
           ~~~
           Octal escape sequences should not be used in string literals.
`,
		},
		{
			code: `
const a = "foo\\1bar";
`,
			snapshot: `
const a = "foo\\1bar";
              ~~
              Octal escape sequences should not be used in string literals.
`,
		},
		{
			code: `
const a = "foo\\01bar";
`,
			snapshot: `
const a = "foo\\01bar";
              ~~~
              Octal escape sequences should not be used in string literals.
`,
		},
		{
			code: `
const a = '\\1';
`,
			snapshot: `
const a = '\\1';
           ~~
           Octal escape sequences should not be used in string literals.
`,
		},
		{
			code: `
const a = '\\01';
`,
			snapshot: `
const a = '\\01';
           ~~~
           Octal escape sequences should not be used in string literals.
`,
		},
	],
	valid: [
		`const a = "\\0";`,
		`const a = "\\8";`,
		`const a = "\\9";`,
		`const a = "\\x01";`,
		`const a = "\\u0001";`,
		`const a = "\\n";`,
		`const a = "\\t";`,
		`const a = "\\\\0";`,
		`const a = "\\\\1";`,
		`const a = "foo\\0bar";`,
		`const a = "foo\\8bar";`,
		`const a = "foo\\9bar";`,
		`const a = '\\0';`,
		`const a = '\\8';`,
		`const a = '\\9';`,
		`const a = \`\\0\`;`,
		`const a = \`\\8\`;`,
	],
});
