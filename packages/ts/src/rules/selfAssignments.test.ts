import rule from "./selfAssignments.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
value = value;
`,
			snapshot: `
value = value;
~~~~~~~~~~~~~
Self-assignment detected.
`,
		},
		{
			code: `
count &&= count;
`,
			snapshot: `
count &&= count;
~~~~~~~~~~~~~~~
Self-assignment detected.
`,
		},
		{
			code: `
flag ||= flag;
`,
			snapshot: `
flag ||= flag;
~~~~~~~~~~~~~
Self-assignment detected.
`,
		},
		{
			code: `
data ??= data;
`,
			snapshot: `
data ??= data;
~~~~~~~~~~~~~
Self-assignment detected.
`,
		},
	],
	valid: [
		`value = other;`,
		`first = second;`,
		`let value = value;`,
		`const data = data;`,
		`value += value;`,
		`count -= count;`,
	],
});
