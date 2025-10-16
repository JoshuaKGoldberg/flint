import rule from "./forDirections.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
for (let index = 0; index < 10; index--) {
    console.log(index);
}
`,
			snapshot: `
for (let index = 0; index < 10; index--) {
                                ~~~~~~~
                                The update moves the counter in the wrong direction for this loop condition.
    console.log(index);
}
`,
		},
		{
			code: `
for (let index = 10; index >= 0; index++) {
    console.log(index);
}
`,
			snapshot: `
for (let index = 10; index >= 0; index++) {
                                 ~~~~~~~
                                 The update moves the counter in the wrong direction for this loop condition.
    console.log(index);
}
`,
		},
		{
			code: `
for (let index = 0; index > 10; index++) {
    console.log(index);
}
`,
			snapshot: `
for (let index = 0; index > 10; index++) {
                                ~~~~~~~
                                The update moves the counter in the wrong direction for this loop condition.
    console.log(index);
}
`,
		},
		{
			code: `
for (let index = 0; 10 > index; index--) {
    console.log(index);
}
`,
			snapshot: `
for (let index = 0; 10 > index; index--) {
                                ~~~~~~~
                                The update moves the counter in the wrong direction for this loop condition.
    console.log(index);
}
`,
		},
		{
			code: `
for (let index = 0; index < 10; index -= 1) {
    console.log(index);
}
`,
			snapshot: `
for (let index = 0; index < 10; index -= 1) {
                                ~~~~~~~~~~
                                The update moves the counter in the wrong direction for this loop condition.
    console.log(index);
}
`,
		},
		{
			code: `
for (let index = 10; index > 0; index += 1) {
    console.log(index);
}
`,
			snapshot: `
for (let index = 10; index > 0; index += 1) {
                                ~~~~~~~~~~
                                The update moves the counter in the wrong direction for this loop condition.
    console.log(index);
}
`,
		},
		{
			code: `
for (let index = 0; index < 10; index += -1) {
    console.log(index);
}
`,
			snapshot: `
for (let index = 0; index < 10; index += -1) {
                                ~~~~~~~~~~~
                                The update moves the counter in the wrong direction for this loop condition.
    console.log(index);
}
`,
		},
	],
	valid: [
		`for (let index = 0; index < 10; index++) { console.log(index); }`,
		`for (let index = 10; index >= 0; index--) { console.log(index); }`,
		`for (let index = 0; 10 > index; index++) { console.log(index); }`,
		`for (let index = 10; 0 < index; index--) { console.log(index); }`,
		`for (let index = 10; index >= 0; index += step) { console.log(index); }`,
		`for (let index = 0; index <= 10; index -= 0) { console.log(index); }`,
		`for (let index = 0; index < 10; index += 1) { console.log(index); }`,
		`for (let index = 10; index > 0; index -= 1) { console.log(index); }`,
		`for (let index = 0; index < 10; index += 2) { console.log(index); }`,
		`for (let index = 10; index > 0; index -= 2) { console.log(index); }`,
	],
});
