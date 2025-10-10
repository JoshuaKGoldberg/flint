import rule from "./negativeZeroComparisons.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
if (value === -0) {}
`,
			snapshot: `
if (value === -0) {}
    ~~~~~~~~~~~~
    Comparisons with -0 using === do not distinguish between -0 and +0.
`,
		},
		{
			code: `
if (-0 === value) {}
`,
			snapshot: `
if (-0 === value) {}
    ~~~~~~~~~~~~
    Comparisons with -0 using === do not distinguish between -0 and +0.
`,
		},
		{
			code: `
if (value == -0) {}
`,
			snapshot: `
if (value == -0) {}
    ~~~~~~~~~~~
    Comparisons with -0 using == do not distinguish between -0 and +0.
`,
		},
		{
			code: `
if (value !== -0) {}
`,
			snapshot: `
if (value !== -0) {}
    ~~~~~~~~~~~~
    Comparisons with -0 using !== do not distinguish between -0 and +0.
`,
		},
		{
			code: `
if (value != -0) {}
`,
			snapshot: `
if (value != -0) {}
    ~~~~~~~~~~~
    Comparisons with -0 using != do not distinguish between -0 and +0.
`,
		},
		{
			code: `
if (value < -0) {}
`,
			snapshot: `
if (value < -0) {}
    ~~~~~~~~~~
    Comparisons with -0 using < do not distinguish between -0 and +0.
`,
		},
		{
			code: `
if (value <= -0) {}
`,
			snapshot: `
if (value <= -0) {}
    ~~~~~~~~~~~
    Comparisons with -0 using <= do not distinguish between -0 and +0.
`,
		},
		{
			code: `
if (value > -0) {}
`,
			snapshot: `
if (value > -0) {}
    ~~~~~~~~~~
    Comparisons with -0 using > do not distinguish between -0 and +0.
`,
		},
		{
			code: `
if (value >= -0) {}
`,
			snapshot: `
if (value >= -0) {}
    ~~~~~~~~~~~
    Comparisons with -0 using >= do not distinguish between -0 and +0.
`,
		},
		{
			code: `
const result = value === -0 ? "negative zero" : "other";
`,
			snapshot: `
const result = value === -0 ? "negative zero" : "other";
               ~~~~~~~~~~~~
               Comparisons with -0 using === do not distinguish between -0 and +0.
`,
		},
		{
			code: `
while (value !== -0) {
	value++;
}
`,
			snapshot: `
while (value !== -0) {
       ~~~~~~~~~~~~
       Comparisons with -0 using !== do not distinguish between -0 and +0.
	value++;
}
`,
		},
		{
			code: `
const isNegativeZero = value === -0;
`,
			snapshot: `
const isNegativeZero = value === -0;
                       ~~~~~~~~~~~~
                       Comparisons with -0 using === do not distinguish between -0 and +0.
`,
		},
	],
	valid: [
		`if (value === 0) {}`,
		`if (value === -1) {}`,
		`if (value === 1) {}`,
		`if (Object.is(value, -0)) {}`,
		`if (Object.is(-0, value)) {}`,
		`const result = -0;`,
		`const value = -0 + 1;`,
		`const value = -0 * 2;`,
		`const value = Math.abs(-0);`,
		`const value = [-0, 0, 1];`,
		`function test() { return -0; }`,
	],
});
