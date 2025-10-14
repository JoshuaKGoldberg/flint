import rule from "./guardedForIns.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
for (const key in object) {
    console.log(key);
}
`,
			snapshot: `
for (const key in object) {
~~~~~~~~~~~~~~~~~~~~~~~~~~
This for loop lacks a filtering condition to avoid iterating over inherited properties.
    console.log(key);
}
`,
		},
		{
			code: `
for (const prop in data) {
    process(prop);
}
`,
			snapshot: `
for (const prop in data) {
~~~~~~~~~~~~~~~~~~~~~~~~~
This for loop lacks a filtering condition to avoid iterating over inherited properties.
    process(prop);
}
`,
		},
		{
			code: `
for (const key in object) {
    const value = object[key];
    doSomething(value);
}
`,
			snapshot: `
for (const key in object) {
~~~~~~~~~~~~~~~~~~~~~~~~~~
This for loop lacks a filtering condition to avoid iterating over inherited properties.
    const value = object[key];
    doSomething(value);
}
`,
		},
		{
			code: `
for (const key in object) {}
`,
			snapshot: `
for (const key in object) {}
~~~~~~~~~~~~~~~~~~~~~~~~~~
This for loop lacks a filtering condition to avoid iterating over inherited properties.
`,
		},
	],
	valid: [
		`
for (const key in object) {
    if (Object.hasOwn(object, key)) {
        console.log(key);
    }
}
`,
		`
for (const key in object) {
    if (object.hasOwnProperty(key)) {
        console.log(key);
    }
}
`,
		`
for (const key in object) {
    if (key !== "inherited") {
        console.log(key);
    }
}
`,
		`
for (const key in object)
    if (Object.hasOwn(object, key))
        console.log(key);
`,
		`
for (const key of Object.keys(object)) {
    console.log(key);
}
`,
		`
Object.keys(object).forEach(key => console.log(key));
`,
	],
});
