import rule from "./returnAssignments.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
function getValue() {
    let value;
    return value = 1;
}
`,
			snapshot: `
function getValue() {
    let value;
    return value = 1;
                 ~
                 Return statements should not contain assignment expressions.
}
`,
		},
		{
			code: `
function process() {
    let result;
    return result = calculate();
}
`,
			snapshot: `
function process() {
    let result;
    return result = calculate();
                  ~
                  Return statements should not contain assignment expressions.
}
`,
		},
		{
			code: `
function update() {
    let status;
    return (status = "updated");
}
`,
			snapshot: `
function update() {
    let status;
    return (status = "updated");
                   ~
                   Return statements should not contain assignment expressions.
}
`,
		},
		{
			code: `
const arrow = () => {
    let value;
    return value = 42;
};
`,
			snapshot: `
const arrow = () => {
    let value;
    return value = 42;
                 ~
                 Return statements should not contain assignment expressions.
};
`,
		},
		{
			code: `
const arrowImplicit = () => (value = 100);
`,
			snapshot: `
const arrowImplicit = () => (value = 100);
                                   ~
                                   Return statements should not contain assignment expressions.
`,
		},
		{
			code: `
function multiply(factor: number) {
    let result;
    return result = factor * 2;
}
`,
			snapshot: `
function multiply(factor: number) {
    let result;
    return result = factor * 2;
                  ~
                  Return statements should not contain assignment expressions.
}
`,
		},
		{
			code: `
function compound() {
    let count;
    return count += 5;
}
`,
			snapshot: `
function compound() {
    let count;
    return count += 5;
                 ~~
                 Return statements should not contain assignment expressions.
}
`,
		},
		{
			code: `
function bitwise() {
    let flags;
    return flags |= 0x01;
}
`,
			snapshot: `
function bitwise() {
    let flags;
    return flags |= 0x01;
                 ~~
                 Return statements should not contain assignment expressions.
}
`,
		},
	],
	valid: [
		`function getValue() { return 1; }`,
		`function getValue() { let value = 1; return value; }`,
		`function process() { const result = calculate(); return result; }`,
		`const arrow = () => { let value = 42; return value; };`,
		`const arrowImplicit = () => getValue();`,
		`
function update() {
    let status = "updated";
    return status;
}
`,
		`
function multiply(factor: number) {
    let result = factor * 2;
    return result;
}
`,
		`
function compound() {
    let count = 0;
    count += 5;
    return count;
}
`,
		`
function calculate() {
    const value = 10;
    return value;
}
`,
		`
const process = (input: number) => {
    const result = input * 2;
    return result;
};
`,
		`
class MyClass {
    method() {
        const value = 42;
        return value;
    }
}
`,
		`
function compare(a: number, b: number) {
    return a === b;
}
`,
		`
function arrowReturn() {
    const fn = () => 42;
    return fn;
}
`,
	],
});
