import rule from "./octalNumbers.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const value = 07;
`,
			snapshot: `
const value = 07;
              ~~
              Use explicit octal syntax with the '0o' prefix instead of legacy octal numeric literals.
`,
		},
		{
			code: `
const value = 077;
`,
			snapshot: `
const value = 077;
              ~~~
              Use explicit octal syntax with the '0o' prefix instead of legacy octal numeric literals.
`,
		},
		{
			code: `
const value = 0123;
`,
			snapshot: `
const value = 0123;
              ~~~~
              Use explicit octal syntax with the '0o' prefix instead of legacy octal numeric literals.
`,
		},
		{
			code: `
const value = 01234567;
`,
			snapshot: `
const value = 01234567;
              ~~~~~~~~
              Use explicit octal syntax with the '0o' prefix instead of legacy octal numeric literals.
`,
		},
		{
			code: `
const values = [01, 02, 03];
`,
			snapshot: `
const values = [01, 02, 03];
                ~~
                Use explicit octal syntax with the '0o' prefix instead of legacy octal numeric literals.
                    ~~
                    Use explicit octal syntax with the '0o' prefix instead of legacy octal numeric literals.
                        ~~
                        Use explicit octal syntax with the '0o' prefix instead of legacy octal numeric literals.
`,
		},
		{
			code: `
function calculate() {
	return 077;
}
`,
			snapshot: `
function calculate() {
	return 077;
        ~~~
        Use explicit octal syntax with the '0o' prefix instead of legacy octal numeric literals.
}
`,
		},
		{
			code: `
const result = 010 + 020;
`,
			snapshot: `
const result = 010 + 020;
               ~~~
               Use explicit octal syntax with the '0o' prefix instead of legacy octal numeric literals.
                     ~~~
                     Use explicit octal syntax with the '0o' prefix instead of legacy octal numeric literals.
`,
		},
	],
	valid: [
		`const value = 0;`,
		`const value = 1;`,
		`const value = 10;`,
		`const value = 100;`,
		`const value = 0x7F;`,
		`const value = 0o77;`,
		`const value = 0O77;`,
		`const value = 0b111;`,
		`const value = 0B111;`,
		`const value = 0.8;`,
		`const value = 8;`,
		`const value = 9;`,
		`const value = 123;`,
		`const values = [0, 1, 10, 100];`,
		`const hex = 0xFF;`,
		`const binary = 0b1010;`,
		`const octal = 0o755;`,
		`const notOctal = 08;`,
		`const alsoNotOctal = 09;`,
	],
});
