import rule from "./equalityOperators.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
if (x == 42) {
	console.log("equal");
}
`,
			snapshot: `
if (x == 42) {
      ~~
      Use === instead of ==.
	console.log("equal");
}
`,
		},
		{
			code: `
if ("" == text) {
	process(text);
}
`,
			snapshot: `
if ("" == text) {
       ~~
       Use === instead of ==.
	process(text);
}
`,
		},
		{
			code: `
if (obj.getStuff() != undefined) {
	return obj.getStuff();
}
`,
			snapshot: `
if (obj.getStuff() != undefined) {
                   ~~
                   Use !== instead of !=.
	return obj.getStuff();
}
`,
		},
		{
			code: `
const result = value == null;
`,
			snapshot: `
const result = value == null;
                     ~~
                     Use === instead of ==.
`,
		},
		{
			code: `
while (count != 0) {
	count--;
}
`,
			snapshot: `
while (count != 0) {
             ~~
             Use !== instead of !=.
	count--;
}
`,
		},
	],
	valid: [
		`if (x === 42) { }`,
		`if ("" === text) { }`,
		`if (obj.getStuff() !== undefined) { }`,
		`const result = value === null;`,
		`while (count !== 0) { }`,
		`const isEqual = a === b;`,
		`const isDifferent = a !== b;`,
	],
});
