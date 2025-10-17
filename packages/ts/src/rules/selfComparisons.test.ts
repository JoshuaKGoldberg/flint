import { ruleTester } from "./ruleTester.js";
import rule from "./selfComparisons.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
if (value === value) {
	console.log("always true");
}
`,
			snapshot: `
if (value === value) {
    ~~~~~~~~~~~~~~~
    Comparing a value to itself is unnecessary and likely indicates a logic error.
	console.log("always true");
}
`,
		},
		{
			code: `
if (value == value) {
	console.log("always true");
}
`,
			snapshot: `
if (value == value) {
    ~~~~~~~~~~~~~~
    Comparing a value to itself is unnecessary and likely indicates a logic error.
	console.log("always true");
}
`,
		},
		{
			code: `
if (value !== value) {
	console.log("always false");
}
`,
			snapshot: `
if (value !== value) {
    ~~~~~~~~~~~~~~~
    Comparing a value to itself is unnecessary and likely indicates a logic error.
	console.log("always false");
}
`,
		},
		{
			code: `
if (value != value) {
	console.log("always false");
}
`,
			snapshot: `
if (value != value) {
    ~~~~~~~~~~~~~~
    Comparing a value to itself is unnecessary and likely indicates a logic error.
	console.log("always false");
}
`,
		},
		{
			code: `
if (value < value) {
	console.log("always false");
}
`,
			snapshot: `
if (value < value) {
    ~~~~~~~~~~~~~
    Comparing a value to itself is unnecessary and likely indicates a logic error.
	console.log("always false");
}
`,
		},
		{
			code: `
if (value <= value) {
	console.log("always true");
}
`,
			snapshot: `
if (value <= value) {
    ~~~~~~~~~~~~~~
    Comparing a value to itself is unnecessary and likely indicates a logic error.
	console.log("always true");
}
`,
		},
		{
			code: `
if (value > value) {
	console.log("always false");
}
`,
			snapshot: `
if (value > value) {
    ~~~~~~~~~~~~~
    Comparing a value to itself is unnecessary and likely indicates a logic error.
	console.log("always false");
}
`,
		},
		{
			code: `
if (value >= value) {
	console.log("always true");
}
`,
			snapshot: `
if (value >= value) {
    ~~~~~~~~~~~~~~
    Comparing a value to itself is unnecessary and likely indicates a logic error.
	console.log("always true");
}
`,
		},
		{
			code: `
const result = object.property === object.property;
`,
			snapshot: `
const result = object.property === object.property;
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
               Comparing a value to itself is unnecessary and likely indicates a logic error.
`,
		},
		{
			code: `
const result = array[0] === array[0];
`,
			snapshot: `
const result = array[0] === array[0];
               ~~~~~~~~~~~~~~~~~~~~~
               Comparing a value to itself is unnecessary and likely indicates a logic error.
`,
		},
		{
			code: `
if (calculate() === calculate()) {
	console.log("functions");
}
`,
			snapshot: `
if (calculate() === calculate()) {
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Comparing a value to itself is unnecessary and likely indicates a logic error.
	console.log("functions");
}
`,
		},
		{
			code: `
if (value /* comment */ === value) {
	console.log("with comment");
}
`,
			snapshot: `
if (value /* comment */ === value) {
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Comparing a value to itself is unnecessary and likely indicates a logic error.
	console.log("with comment");
}
`,
		},
		{
			code: `
if (object.property /* comment */ === object.property) {
	console.log("with comment in property access");
}
`,
			snapshot: `
if (object.property /* comment */ === object.property) {
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Comparing a value to itself is unnecessary and likely indicates a logic error.
	console.log("with comment in property access");
}
`,
		},
		{
			code: `
if (array /* comment */ [0] === array[0]) {
	console.log("with comment in array access");
}
`,
			snapshot: `
if (array /* comment */ [0] === array[0]) {
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Comparing a value to itself is unnecessary and likely indicates a logic error.
	console.log("with comment in array access");
}
`,
		},
	],
	valid: [
		`if (value1 === value2) { console.log("different values"); }`,
		`if (value === other) { console.log("different values"); }`,
		`if (object.property === object.otherProperty) { console.log("different properties"); }`,
		`if (array[0] === array[1]) { console.log("different elements"); }`,
		`const result = value1 == value2;`,
		`const result = value1 != value2;`,
		`const result = value1 !== value2;`,
		`const result = value1 < value2;`,
		`const result = value1 <= value2;`,
		`const result = value1 > value2;`,
		`const result = value1 >= value2;`,
		`if (Number.isNaN(value)) { console.log("checking for NaN correctly"); }`,
	],
});
