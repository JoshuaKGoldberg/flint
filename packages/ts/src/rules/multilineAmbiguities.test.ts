import rule from "./multilineAmbiguities.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const value = identifier
(expression).doSomething()
`,
			snapshot: `
const value = identifier
(expression).doSomething()
~~~~~~~~~~~~~~~~~~~~~~~~~~
Avoid ambiguous line breaks before parentheses that could be interpreted as function calls.
`,
		},
		{
			code: `
const value = identifier
[element].forEach(callback)
`,
			snapshot: `
const value = identifier
[element].forEach(callback)
~~~~~~~~~~~~~~~~~~~~~~~~~~~
Avoid ambiguous line breaks before brackets that could be interpreted as property access.
`,
		},
		{
			code: `
const value = identifier
\`template literal\`
`,
			snapshot: `
const value = identifier
\`template literal\`
~~~~~~~~~~~~~~~~~~
Avoid ambiguous line breaks before template literals that could be interpreted as tagged templates.
`,
		},
		{
			code: `
const a = b
(c || d).doSomething()
`,
			snapshot: `
const a = b
(c || d).doSomething()
~~~~~~~~~~~~~~~~~~~~~~
Avoid ambiguous line breaks before parentheses that could be interpreted as function calls.
`,
		},
		{
			code: `
const e = f
[g].forEach(x => x)
`,
			snapshot: `
const e = f
[g].forEach(x => x)
~~~~~~~~~~~~~~~~~~~
Avoid ambiguous line breaks before brackets that could be interpreted as property access.
`,
		},
		{
			code: `
const h = i
\`template\`
`,
			snapshot: `
const h = i
\`template\`
~~~~~~~~~~
Avoid ambiguous line breaks before template literals that could be interpreted as tagged templates.
`,
		},
		{
			code: `
function test() {
    const result = calculate()
    (value + 1).toString()
}
`,
			snapshot: `
function test() {
    const result = calculate()
    (value + 1).toString()
   ~~~~~~~~~~~~~~~~~~~~~~~
   Avoid ambiguous line breaks before parentheses that could be interpreted as function calls.
}
`,
		},
		{
			code: `
class MyClass {
    method() {
        const data = getData()
        [0].value
    }
}
`,
			snapshot: `
class MyClass {
    method() {
        const data = getData()
        [0].value
       ~~~~~~~~~~
       Avoid ambiguous line breaks before brackets that could be interpreted as property access.
    }
}
`,
		},
	],
	valid: [
		`const value = identifier(expression).doSomething()`,
		`const value = identifier[element].forEach(callback)`,
		"const value = identifier`template literal`",
		`
const value = identifier;
(expression).doSomething()
`,
		`
const value = identifier;
[element].forEach(callback)
`,
		"const value = identifier;\n`template literal`",
		`
const a = b;
(c || d).doSomething()
`,
		`
const e = f;
[g].forEach(x => x)
`,
		"const h = i;\n`template`",
		`
function test() {
    const result = calculate();
    (value + 1).toString()
}
`,
		`
class MyClass {
    method() {
        const data = getData();
        [0].value
    }
}
`,
		`const value = call(); const other = value`,
		`
const value = getData();
const element = [1, 2, 3];
`,
	],
});
