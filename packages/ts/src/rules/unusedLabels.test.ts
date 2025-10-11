import { ruleTester } from "./ruleTester.js";
import rule from "./unusedLabels.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
unused: for (let i = 0; i < 10; i++) {
    console.log(i);
}
`,
			snapshot: `
unused: for (let i = 0; i < 10; i++) {
~~~~~~
Label 'unused' is declared but never used with a break or continue statement.
    console.log(i);
}
`,
		},
		{
			code: `
unused: {
    console.log("block");
}
`,
			snapshot: `
unused: {
~~~~~~
Label 'unused' is declared but never used with a break or continue statement.
    console.log("block");
}
`,
		},
		{
			code: `
outer: for (let i = 0; i < 10; i++) {
    inner: for (let j = 0; j < 10; j++) {
        console.log(i, j);
    }
}
`,
			snapshot: `
outer: for (let i = 0; i < 10; i++) {
~~~~~
Label 'outer' is declared but never used with a break or continue statement.
    inner: for (let j = 0; j < 10; j++) {
    ~~~~~
    Label 'inner' is declared but never used with a break or continue statement.
        console.log(i, j);
    }
}
`,
		},
		{
			code: `
unused: while (true) {
    break;
}
`,
			snapshot: `
unused: while (true) {
~~~~~~
Label 'unused' is declared but never used with a break or continue statement.
    break;
}
`,
		},
		{
			code: `
unused: do {
    console.log("test");
} while (false);
`,
			snapshot: `
unused: do {
~~~~~~
Label 'unused' is declared but never used with a break or continue statement.
    console.log("test");
} while (false);
`,
		},
	],
	valid: [
		`for (let i = 0; i < 10; i++) { console.log(i); }`,
		`
used: for (let i = 0; i < 10; i++) {
    if (i === 5) break used;
    console.log(i);
}
`,
		`
loopLabel: for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        if (j === 5) continue loopLabel;
    }
}
`,
		`
outer: for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        if (i === 5 && j === 5) break outer;
    }
}
`,
		`
used: {
    if (true) break used;
    console.log("block");
}
`,
	],
});
