import rule from "./atAccesses.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const last = array[array.length - 1];
`,
			snapshot: `
const last = array[array.length - 1];
             ~~~~~~~~~~~~~~~~~~~~~~~
             Prefer using .at() with a negative index instead of calculating length minus an offset.
`,
		},
		{
			code: `
const secondLast = items[items.length - 2];
`,
			snapshot: `
const secondLast = items[items.length - 2];
                   ~~~~~~~~~~~~~~~~~~~~~~~
                   Prefer using .at() with a negative index instead of calculating length minus an offset.
`,
		},
		{
			code: `
const char = str[str.length - 1];
`,
			snapshot: `
const char = str[str.length - 1];
             ~~~~~~~~~~~~~~~~~~~
             Prefer using .at() with a negative index instead of calculating length minus an offset.
`,
		},
		{
			code: `
const value = this.data[this.data.length - 1];
`,
			snapshot: `
const value = this.data[this.data.length - 1];
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
              Prefer using .at() with a negative index instead of calculating length minus an offset.
`,
		},
		{
			code: `
const element = getArray()[getArray().length - 1];
`,
			snapshot: `
const element = getArray()[getArray().length - 1];
                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                Prefer using .at() with a negative index instead of calculating length minus an offset.
`,
		},
	],
	valid: [
		`const first = array[0];`,
		`const last = array.at(-1);`,
		`const element = array[index];`,
		`const value = array[someVar - 1];`,
		`const item = array[other.length - 1];`,
		`const char = str.charAt(0);`,
		`const last = array[array.length];`,
		`const value = array[array.length + 1];`,
		`const item = array[array.length - 0];`,
	],
});
