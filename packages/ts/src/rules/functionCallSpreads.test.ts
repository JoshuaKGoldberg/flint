import rule from "./functionCallSpreads.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
foo.apply(undefined, args);
`,
			snapshot: `
foo.apply(undefined, args);
~~~~~~~~~~~~~~~~~~~~~~~~~~
Use the spread operator instead of \`.apply()\`.
`,
		},
		{
			code: `
foo.apply(null, args);
`,
			snapshot: `
foo.apply(null, args);
~~~~~~~~~~~~~~~~~~~~~
Use the spread operator instead of \`.apply()\`.
`,
		},
		{
			code: `
obj.foo.apply(obj, args);
`,
			snapshot: `
obj.foo.apply(obj, args);
~~~~~~~~~~~~~~~~~~~~~~~~
Use the spread operator instead of \`.apply()\`.
`,
		},
		{
			code: `
a.b.c.apply(a.b, args);
`,
			snapshot: `
a.b.c.apply(a.b, args);
~~~~~~~~~~~~~~~~~~~~~~
Use the spread operator instead of \`.apply()\`.
`,
		},
		{
			code: `
Math.max.apply(Math, numbers);
`,
			snapshot: `
Math.max.apply(Math, numbers);
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Use the spread operator instead of \`.apply()\`.
`,
		},
	],
	valid: [
		`foo(...args);`,
		`obj.foo(...args);`,
		`Math.max(...numbers);`,
		`foo.apply(obj, args);`,
		`foo.apply(undefined, [1, 2, 3]);`,
		`foo.apply(null, [a, b, c]);`,
		`foo.call(undefined, ...args);`,
		`foo.apply(otherThis, args);`,
		`foo.apply();`,
		`foo.apply(undefined);`,
		`foo.apply(undefined, args, extra);`,
		`foo.bar.apply(otherObj, args);`,
		`[].push.apply(array, items);`,
	],
});
