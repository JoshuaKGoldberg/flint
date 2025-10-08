import rule from "./chainedAssignments.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
let first, second;
first = second = 1;
`,
			snapshot: `
let first, second;
first = second = 1;
      ~
      Use separate assignment statements instead of chaining assignments.
`,
		},
		{
			code: `
let first, second, third;
first = second = third = 0;
`,
			snapshot: `
let first, second, third;
first = second = third = 0;
      ~
      Use separate assignment statements instead of chaining assignments.
`,
		},
		{
			code: `
let value, another;
value = another = getValue();
`,
			snapshot: `
let value, another;
value = another = getValue();
      ~
      Use separate assignment statements instead of chaining assignments.
`,
		},
		{
			code: `
let first, second;
(first = second = 1);
`,
			snapshot: `
let first, second;
(first = second = 1);
       ~
       Use separate assignment statements instead of chaining assignments.
`,
		},
		{
			code: `
const calculate = (value: number) => {
    let first, second;
    first = second = value;
    return first + second;
};
`,
			snapshot: `
const calculate = (value: number) => {
    let first, second;
    first = second = value;
          ~
          Use separate assignment statements instead of chaining assignments.
    return first + second;
};
`,
		},
		{
			code: `
let first, second;
if (true) {
    first = second = 10;
}
`,
			snapshot: `
let first, second;
if (true) {
    first = second = 10;
          ~
          Use separate assignment statements instead of chaining assignments.
}
`,
		},
		{
			code: `
class MyClass {
    method() {
        let first, second;
        first = second = 0;
    }
}
`,
			snapshot: `
class MyClass {
    method() {
        let first, second;
        first = second = 0;
              ~
              Use separate assignment statements instead of chaining assignments.
    }
}
`,
		},
		{
			code: `
let first, second, third;
first = (second = third = 5);
`,
			snapshot: `
let first, second, third;
first = (second = third = 5);
        ~
        Use separate assignment statements instead of chaining assignments.
`,
		},
	],
	valid: [
		`let first = 1;`,
		`let first = 1, second = 2;`,
		`let first = 1; let second = 2;`,
		`let first, second; first = 1; second = 2;`,
		`let first, second; first = 1; second = first;`,
		`const value = getValue();`,
		`let first; first = 1;`,
		`
let first, second;
first = 1;
second = 2;
`,
		`
let first, second, third;
first = 1;
second = 2;
third = 3;
`,
		`
const calculate = (value: number) => {
    let first, second;
    first = value;
    second = value;
    return first + second;
};
`,
		`
class MyClass {
    method() {
        let first, second;
        first = 0;
        second = 0;
    }
}
`,
	],
});
