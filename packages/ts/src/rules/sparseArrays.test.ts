import rule from "./sparseArrays.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const array = [1, , 3];
`,
			snapshot: `
const array = [1, , 3];
                  ~
                  Avoid sparse arrays with holes. Use explicit \`undefined\` values instead.
`,
		},
		{
			code: `
const array = [, 2, 3];
`,
			snapshot: `
const array = [, 2, 3];
                  ~
                  Avoid sparse arrays with holes. Use explicit \`undefined\` values instead.
`,
		},
		{
			code: `
const array = [1, , , 4];
`,
			snapshot: `
const array = [1, , , 4];
                  ~
                  Avoid sparse arrays with holes. Use explicit \`undefined\` values instead.
                    ~
                    Avoid sparse arrays with holes. Use explicit \`undefined\` values instead.
`,
		},
		{
			code: `
const nested = [[1, , 3], [4, 5, 6]];
`,
			snapshot: `
const nested = [[1, , 3], [4, 5, 6]];
                    ~
                    Avoid sparse arrays with holes. Use explicit \`undefined\` values instead.
`,
		},
		{
			code: `
const result = [
    1,
    ,
    3
];
`,
			snapshot: `
const result = [
    1,
    ,
    ~
    Avoid sparse arrays with holes. Use explicit \`undefined\` values instead.
    3
];
`,
		},
		{
			code: `
const matrix = [
    [1, 2, 3],
    [4, , 6],
    [7, 8, 9]
];
`,
			snapshot: `
const matrix = [
    [1, 2, 3],
    [4, , 6],
        ~
        Avoid sparse arrays with holes. Use explicit \`undefined\` values instead.
    [7, 8, 9]
];
`,
		},
		{
			code: `
function getArray() {
    return [1, , 3];
}
`,
			snapshot: `
function getArray() {
    return [1, , 3];
               ~
               Avoid sparse arrays with holes. Use explicit \`undefined\` values instead.
}
`,
		},
	],
	valid: [
		`const array = [1, 2, 3];`,
		`const array = [];`,
		`const array = [1];`,
		`const array = [1, undefined, 3];`,
		`const array = [undefined, 2, 3];`,
		`const array = [1, 2, undefined];`,
		`const array = [1, 2, 3,];`,
		`const nested = [[1, undefined, 3], [4, 5, 6]];`,
		`const matrix = [[1, 2, 3], [4, undefined, 6], [7, 8, 9]];`,
		`const values = [null, undefined, 0, false, ""];`,
	],
});
