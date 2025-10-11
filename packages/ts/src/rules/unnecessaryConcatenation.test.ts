import { ruleTester } from "./ruleTester.js";
import rule from "./unnecessaryConcatenation.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const message = "Hello" + "World";
`,
			snapshot: `
const message = "Hello" + "World";
                        ~
                        Combine consecutive string literals instead of using the + operator.
`,
		},
		{
			code: `
const path = 'foo' + 'bar';
`,
			snapshot: `
const path = 'foo' + 'bar';
                   ~
                   Combine consecutive string literals instead of using the + operator.
`,
		},
		{
			code: `
const result = "abc" + "def" + "ghi";
`,
			snapshot: `
const result = "abc" + "def" + "ghi";
                     ~
                     Combine consecutive string literals instead of using the + operator.
`,
		},
		{
			code: `
const text = "first" + "second";
`,
			snapshot: `
const text = "first" + "second";
                     ~
                     Combine consecutive string literals instead of using the + operator.
`,
		},
		{
			code: `
const mixed = 'single' + "double";
`,
			snapshot: `
const mixed = 'single' + "double";
                       ~
                       Combine consecutive string literals instead of using the + operator.
`,
		},
		{
			code: `
const withSpace = "Hello " + "World";
`,
			snapshot: `
const withSpace = "Hello " + "World";
                           ~
                           Combine consecutive string literals instead of using the + operator.
`,
		},
		{
			code: `
const longString = "This is a very long string that " +
    "continues on the next line";
`,
			snapshot: `
const longString = "This is a very long string that " +
                                                      ~
                                                      Combine consecutive string literals instead of using the + operator.
    "continues on the next line";
`,
		},
	],
	valid: [
		`const message = "Hello" + variable;`,
		`const message = variable + "World";`,
		`const result = variable1 + variable2;`,
		`const template = \`Hello\${name}World\`;`,
		`const number = 1 + 2;`,
		`const mixed = "Hello" + getName() + "World";`,
		`const value = "prefix" + getValue();`,
	],
});
