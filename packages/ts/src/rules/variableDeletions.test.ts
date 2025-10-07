import rule from "./variableDeletions.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
delete value;
`,
			snapshot: `
delete value;
~~~~~~~~~~~~
Variables should not be deleted with the delete operator.
`,
		},
		{
			code: `
let x = 5;
delete x;
`,
			snapshot: `
let x = 5;
delete x;
~~~~~~~~
Variables should not be deleted with the delete operator.
`,
		},
		{
			code: `
const variable = 10;
delete variable;
`,
			snapshot: `
const variable = 10;
delete variable;
~~~~~~~~~~~~~~~
Variables should not be deleted with the delete operator.
`,
		},
		{
			code: `
function test(parameter: number) {
	delete parameter;
}
`,
			snapshot: `
function test(parameter: number) {
	delete parameter;
 ~~~~~~~~~~~~~~~~
 Variables should not be deleted with the delete operator.
}
`,
		},
		{
			code: `
for (let index = 0; index < 10; index++) {
	delete index;
}
`,
			snapshot: `
for (let index = 0; index < 10; index++) {
	delete index;
 ~~~~~~~~~~~~
 Variables should not be deleted with the delete operator.
}
`,
		},
	],
	valid: [
		`const obj = { prop: 1 }; delete obj.prop;`,
		`delete obj.property;`,
		`delete obj["property"];`,
		`const obj = { nested: { prop: 1 } }; delete obj.nested.prop;`,
		`const array = [1, 2, 3]; delete array[0];`,
	],
});
