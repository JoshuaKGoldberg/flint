import rule from "./forDirections.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
for (let i = 0; i < 10; i--) {}
`,
			snapshot: `
for (let i = 0; i < 10; i--) {}
                        ~~~
                        The update moves the counter in the wrong direction for this loop condition.
`,
		},
		{
			code: `
for (let index = 0; index < 10; index--) {}
`,
			snapshot: `
for (let index = 0; index < 10; index--) {}
                                ~~~~~~~
                                The update moves the counter in the wrong direction for this loop condition.
`,
		},
		{
			code: `
for (let index = 10; index >= 0; index++) {}
`,
			snapshot: `
for (let index = 10; index >= 0; index++) {}
                                 ~~~~~~~
                                 The update moves the counter in the wrong direction for this loop condition.
`,
		},
		{
			code: `
for (let index = 0; index > 10; index++) {}
`,
			snapshot: `
for (let index = 0; index > 10; index++) {}
                                ~~~~~~~
                                The update moves the counter in the wrong direction for this loop condition.
`,
		},
		{
			code: `
for (let index = 0; 10 > index; index--) {}
`,
			snapshot: `
for (let index = 0; 10 > index; index--) {}
                                ~~~~~~~
                                The update moves the counter in the wrong direction for this loop condition.
`,
		},
		{
			code: `
for (let index = 0; index < 10; index -= 1) {}
`,
			snapshot: `
for (let index = 0; index < 10; index -= 1) {}
                                ~~~~~~~~~~
                                The update moves the counter in the wrong direction for this loop condition.
`,
		},
		{
			code: `
for (let index = 10; index > 0; index += 1) {}
`,
			snapshot: `
for (let index = 10; index > 0; index += 1) {}
                                ~~~~~~~~~~
                                The update moves the counter in the wrong direction for this loop condition.
`,
		},
		{
			code: `
for (let index = 0; index < 10; index += -1) {}
`,
			snapshot: `
for (let index = 0; index < 10; index += -1) {}
                                ~~~~~~~~~~~
                                The update moves the counter in the wrong direction for this loop condition.
`,
		},
	],
	valid: [
		`for (let i = 0; i < 10; i++) { }`,
		`for (let index = 0; index < 10; index++) { }`,
		`for (let index = 10; index >= 0; index--) { }`,
		`for (let index = 0; 10 > index; index++) { }`,
		`for (let index = 10; 0 < index; index--) { }`,
		`for (let index = 10; index >= 0; index += step) { }`,
		`for (let index = 0; index <= 10; index -= 0) { }`,
		`for (let index = 0; index < 10; index += 1) { }`,
		`for (let index = 10; index > 0; index -= 1) { }`,
		`for (let index = 0; index < 10; index += 2) { }`,
		`for (let index = 10; index > 0; index -= 2) { }`,
	],
});
