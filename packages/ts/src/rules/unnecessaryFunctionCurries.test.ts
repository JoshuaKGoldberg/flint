import { ruleTester } from "./ruleTester.js";
import rule from "./unnecessaryFunctionCurries.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
function add(a, b) {
    return a + b;
}
const result = add.call(undefined, 1, 2);
`,
			snapshot: `
function add(a, b) {
    return a + b;
}
const result = add.call(undefined, 1, 2);
                  ~~~~~~~~~~~~~~~~~~~~~~
                  Prefer direct function calls over unnecessary .call() or .apply() with null or undefined context.
`,
		},
		{
			code: `
function add(a, b) {
    return a + b;
}
const result = add.call(null, 1, 2);
`,
			snapshot: `
function add(a, b) {
    return a + b;
}
const result = add.call(null, 1, 2);
                  ~~~~~~~~~~~~~~~~~
                  Prefer direct function calls over unnecessary .call() or .apply() with null or undefined context.
`,
		},
		{
			code: `
function add(a, b) {
    return a + b;
}
const result = add.apply(undefined, [1, 2]);
`,
			snapshot: `
function add(a, b) {
    return a + b;
}
const result = add.apply(undefined, [1, 2]);
                  ~~~~~~~~~~~~~~~~~~~~~~~~~
                  Prefer direct function calls over unnecessary .call() or .apply() with null or undefined context.
`,
		},
		{
			code: `
function add(a, b) {
    return a + b;
}
const result = add.apply(null, [1, 2]);
`,
			snapshot: `
function add(a, b) {
    return a + b;
}
const result = add.apply(null, [1, 2]);
                  ~~~~~~~~~~~~~~~~~~~~
                  Prefer direct function calls over unnecessary .call() or .apply() with null or undefined context.
`,
		},
		{
			code: `
const fn = (x: number) => x * 2;
const value = fn.call(undefined, 5);
`,
			snapshot: `
const fn = (x: number) => x * 2;
const value = fn.call(undefined, 5);
                ~~~~~~~~~~~~~~~~~~~
                Prefer direct function calls over unnecessary .call() or .apply() with null or undefined context.
`,
		},
		{
			code: `
const callback = function(name: string) {
    return name.toUpperCase();
};
callback.apply(null, ["test"]);
`,
			snapshot: `
const callback = function(name: string) {
    return name.toUpperCase();
};
callback.apply(null, ["test"]);
        ~~~~~~~~~~~~~~~~~~~~~~
        Prefer direct function calls over unnecessary .call() or .apply() with null or undefined context.
`,
		},
	],
	valid: [
		`function add(a, b) { return a + b; } const result = add(1, 2);`,
		`const obj = { value: 10, getValue: function() { return this.value; } }; obj.getValue();`,
		`const obj = { value: 10 }; function getValue() { return this.value; } const result = getValue.call(obj);`,
		`const obj1 = { method: function() { return 42; } }; const obj2 = {}; obj1.method.call(obj2);`,
		`
function greet() {
    return this.name;
}
const person = { name: "Alice" };
const result = greet.call(person);
`,
		`
const obj = {
    value: 42,
    getValue: function() {
        return this.value;
    }
};
const result = obj.getValue.call(obj);
`,
	],
});
