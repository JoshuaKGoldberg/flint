import rule from "./emptyDestructures.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const {} = object;
`,
			snapshot: `
const {} = object;
      ~~
      Destructuring patterns should extract at least one value from the source.
`,
		},
		{
			code: `
const [] = array;
`,
			snapshot: `
const [] = array;
      ~~
      Destructuring patterns should extract at least one value from the source.
`,
		},
		{
			code: `
function process({}) {
    console.log("processed");
}
`,
			snapshot: `
function process({}) {
                 ~~
                 Destructuring patterns should extract at least one value from the source.
    console.log("processed");
}
`,
		},
		{
			code: `
function process([]) {
    console.log("processed");
}
`,
			snapshot: `
function process([]) {
                 ~~
                 Destructuring patterns should extract at least one value from the source.
    console.log("processed");
}
`,
		},
		{
			code: `
const process = ({}) => {
    console.log("processed");
};
`,
			snapshot: `
const process = ({}) => {
                 ~~
                 Destructuring patterns should extract at least one value from the source.
    console.log("processed");
};
`,
		},
		{
			code: `
const process = ([]) => {
    console.log("processed");
};
`,
			snapshot: `
const process = ([]) => {
                 ~~
                 Destructuring patterns should extract at least one value from the source.
    console.log("processed");
};
`,
		},
		{
			code: `
const { prop: {} } = object;
`,
			snapshot: `
const { prop: {} } = object;
              ~~
              Destructuring patterns should extract at least one value from the source.
`,
		},
		{
			code: `
const { prop: [] } = object;
`,
			snapshot: `
const { prop: [] } = object;
              ~~
              Destructuring patterns should extract at least one value from the source.
`,
		},
		{
			code: `
for (const {} of objects) {
    console.log("iterating");
}
`,
			snapshot: `
for (const {} of objects) {
           ~~
           Destructuring patterns should extract at least one value from the source.
    console.log("iterating");
}
`,
		},
		{
			code: `
for (const [] of arrays) {
    console.log("iterating");
}
`,
			snapshot: `
for (const [] of arrays) {
           ~~
           Destructuring patterns should extract at least one value from the source.
    console.log("iterating");
}
`,
		},
		{
			code: `
try {
    doSomething();
} catch ({}) {
    console.log("error");
}
`,
			snapshot: `
try {
    doSomething();
} catch ({}) {
         ~~
         Destructuring patterns should extract at least one value from the source.
    console.log("error");
}
`,
		},
		{
			code: `
try {
    doSomething();
} catch ([]) {
    console.log("error");
}
`,
			snapshot: `
try {
    doSomething();
} catch ([]) {
         ~~
         Destructuring patterns should extract at least one value from the source.
    console.log("error");
}
`,
		},
	],
	valid: [
		`const { a } = object;`,
		`const { a, b } = object;`,
		`const [ a ] = array;`,
		`const [ a, b ] = array;`,
		`function process({ a }) { console.log(a); }`,
		`function process([ a ]) { console.log(a); }`,
		`const process = ({ a }) => console.log(a);`,
		`const process = ([ a ]) => console.log(a);`,
		`const { prop: { nested } } = object;`,
		`const { prop: [ element ] } = object;`,
		`for (const { value } of objects) { console.log(value); }`,
		`for (const [ value ] of arrays) { console.log(value); }`,
		`try { doSomething(); } catch ({ message }) { console.log(message); }`,
		`try { doSomething(); } catch ([ first ]) { console.log(first); }`,
		`const object = {};`,
		`const array = [];`,
		`function returnEmpty() { return {}; }`,
		`function returnEmptyArray() { return []; }`,
	],
});
