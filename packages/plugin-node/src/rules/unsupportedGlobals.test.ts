import { ruleTester } from "./ruleTester.js";
import rule from "./unsupportedGlobals.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const value = BigInt(123);
`,
			snapshot: `
const value = BigInt(123);
              ~~~~~~
              The global \`BigInt\` is not supported in Node.js versions before 10.4.0.
`,
		},
		{
			code: `
const array = new BigInt64Array(10);
`,
			snapshot: `
const array = new BigInt64Array(10);
                  ~~~~~~~~~~~~~
                  The global \`BigInt64Array\` is not supported in Node.js versions before 10.4.0.
`,
		},
		{
			code: `
const array = new BigUint64Array(10);
`,
			snapshot: `
const array = new BigUint64Array(10);
                  ~~~~~~~~~~~~~~
                  The global \`BigUint64Array\` is not supported in Node.js versions before 10.4.0.
`,
		},
		{
			code: `
const registry = new FinalizationRegistry(() => {});
`,
			snapshot: `
const registry = new FinalizationRegistry(() => {});
                     ~~~~~~~~~~~~~~~~~~~~
                     The global \`FinalizationRegistry\` is not supported in Node.js versions before 14.6.0.
`,
		},
		{
			code: `
const ref = new WeakRef(target);
`,
			snapshot: `
const ref = new WeakRef(target);
                ~~~~~~~
                The global \`WeakRef\` is not supported in Node.js versions before 14.6.0.
`,
		},
		{
			code: `
const error = new AggregateError(errors, message);
`,
			snapshot: `
const error = new AggregateError(errors, message);
                  ~~~~~~~~~~~~~~
                  The global \`AggregateError\` is not supported in Node.js versions before 15.0.0.
`,
		},
		{
			code: `
const global = globalThis;
`,
			snapshot: `
const global = globalThis;
               ~~~~~~~~~~
               The global \`globalThis\` is not supported in Node.js versions before 12.0.0.
`,
		},
	],
	valid: [
		`const value = 123n;`,
		`const custom = new CustomBigInt();`,
		`const obj = { BigInt: () => {} };`,
		`const value = obj.BigInt();`,
		`if (typeof BigInt !== 'undefined') { }`,
		`function BigInt() { return 0; }`,
		`const BigInt = 42;`,
	],
});
