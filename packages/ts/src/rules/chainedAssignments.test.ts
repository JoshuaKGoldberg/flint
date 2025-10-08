import rule from "./chainedAssignments.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
let first;
let second;
first = second = 1;
`,
			snapshot: `
let first;
let second;
first = second = 1;
      ~
      Use separate assignment statements instead of chaining assignments.
`,
		},
		{
			code: `
let first;
let second;
let third;
first = second = third = 0;
`,
			snapshot: `
let first;
let second;
let third;
first = second = third = 0;
      ~
      Use separate assignment statements instead of chaining assignments.
`,
		},
		{
			code: `
let value;
let another;
value = another = getValue();
`,
			snapshot: `
let value;
let another;
value = another = getValue();
      ~
      Use separate assignment statements instead of chaining assignments.
`,
		},
		{
			code: `
let first;
let second;
(first = second = 1);
`,
			snapshot: `
let first;
let second;
(first = second = 1);
       ~
       Use separate assignment statements instead of chaining assignments.
`,
		},
		{
			code: `
const calculate = (value: number) => {
    let first;
    let second;
    first = second = value;
    return first + second;
};
`,
			snapshot: `
const calculate = (value: number) => {
    let first;
    let second;
    first = second = value;
          ~
          Use separate assignment statements instead of chaining assignments.
    return first + second;
};
`,
		},
		{
			code: `
let first;
let second;
if (true) {
    first = second = 10;
}
`,
			snapshot: `
let first;
let second;
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
        let first;
        let second;
        first = second = 0;
    }
}
`,
			snapshot: `
class MyClass {
    method() {
        let first;
        let second;
        first = second = 0;
              ~
              Use separate assignment statements instead of chaining assignments.
    }
}
`,
		},
		{
			code: `
let first;
let second;
let third;
first = (second = third = 5);
`,
			snapshot: `
let first;
let second;
let third;
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
		`let first; let second; first = 1; second = 2;`,
		`let first; let second; first = 1; second = first;`,
		`const value = getValue();`,
		`let first; first = 1;`,
		`
let first;
let second;
first = 1;
second = 2;
`,
		`
let first;
let second;
let third;
first = 1;
second = 2;
third = 3;
`,
		`
const calculate = (value: number) => {
    let first;
    let second;
    first = value;
    second = value;
    return first + second;
};
`,
		`
class MyClass {
    method() {
        let first;
        let second;
        first = 0;
        second = 0;
    }
}
`,
	],
});
