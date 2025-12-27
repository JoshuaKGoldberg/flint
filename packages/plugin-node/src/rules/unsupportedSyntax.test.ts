import { ruleTester } from "./ruleTester.js";
import rule from "./unsupportedSyntax.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const value = first ?? second;
`,
			snapshot: `
const value = first ?? second;
                    ~~
                    The nullish coalescing operators feature requires Node.js 14.0.0 or later.
`,
		},
		{
			code: `
value ??= defaultValue;
`,
			snapshot: `
value ??= defaultValue;
      ~~~
      The logical assignment operators feature requires Node.js 15.0.0 or later.
`,
		},
		{
			code: `
value &&= newValue;
`,
			snapshot: `
value &&= newValue;
      ~~~
      The logical assignment operators feature requires Node.js 15.0.0 or later.
`,
		},
		{
			code: `
value ||= newValue;
`,
			snapshot: `
value ||= newValue;
      ~~~
      The logical assignment operators feature requires Node.js 15.0.0 or later.
`,
		},
		{
			code: `
const result = object?.property;
`,
			snapshot: `
const result = object?.property;
               ~~~~~~~~~~~~~~~~
               The optional chaining feature requires Node.js 14.0.0 or later.
`,
		},
		{
			code: `
const result = object?.method?.();
`,
			snapshot: `
const result = object?.method?.();
               ~~~~~~~~~~~~~~
               The optional chaining feature requires Node.js 14.0.0 or later.
`,
		},
		{
			code: `
const largeNumber = 123456789n;
`,
			snapshot: `
const largeNumber = 123456789n;
                    ~~~~~~~~~~
                    The bigint feature requires Node.js 10.4.0 or later.
`,
		},
	],
	valid: [
		`const value = first !== null && first !== undefined ? first : second;`,
		`if (value === undefined) { value = defaultValue; }`,
		`if (value) { value = newValue; }`,
		`const result = object && object.property;`,
		`const largeNumber = 123456789;`,
		`const value = await fetch();`,
		`async function fetchData() { const value = await fetch(); }`,
		`const asyncFn = async () => { const value = await fetch(); };`,
	],
});
