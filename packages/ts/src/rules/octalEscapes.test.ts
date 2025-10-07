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
           Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = "\\2";
`,
			snapshot: `
const a = "\\2";
           ~~
           Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = "\\7";
`,
			snapshot: `
const a = "\\7";
           ~~
           Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = "\\00";
`,
			snapshot: `
const a = "\\00";
           ~~~
           Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = "\\01";
`,
			snapshot: `
const a = "\\01";
           ~~~
           Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = "\\02";
`,
			snapshot: `
const a = "\\02";
           ~~~
           Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = "\\07";
`,
			snapshot: `
const a = "\\07";
           ~~~
           Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = "\\377";
`,
			snapshot: `
const a = "\\377";
           ~~~~
           Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = "\\12";
`,
			snapshot: `
const a = "\\12";
           ~~~
           Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = "foo\\1bar";
`,
			snapshot: `
const a = "foo\\1bar";
              ~~
              Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = "foo\\01bar";
`,
			snapshot: `
const a = "foo\\01bar";
              ~~~
              Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = '\\1';
`,
			snapshot: `
const a = '\\1';
           ~~
           Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = '\\01';
`,
			snapshot: `
const a = '\\01';
           ~~~
           Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = \`\\1\`;
`,
			snapshot: `
const a = \`\\1\`;
           ~~
           Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = \`\\01\`;
`,
			snapshot: `
const a = \`\\01\`;
           ~~~
           Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const a = \`foo\\1bar\`;
`,
			snapshot: `
const a = \`foo\\1bar\`;
              ~~
              Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const x = 5;
const a = \`value: \${x} \\1\`;
`,
			snapshot: `
const x = 5;
const a = \`value: \${x} \\1\`;
                       ~~
                       Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
`,
		},
		{
			code: `
const x = 5;
const a = \`\\01 value: \${x}\`;
`,
			snapshot: `
const x = 5;
const a = \`\\01 value: \${x}\`;
           ~~~
           Prefer hexadecimal or Unicode escape sequences over legacy octal escape sequences.
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
		`const a = \`\\9\`;`,
		`const x = 5; const a = \`value: \${x} \\0\`;`,
		`const x = 5; const a = \`\\0 value: \${x}\`;`,
		`const x = 5; const a = \`\\8 \${x} \\9\`;`,
	],
});
