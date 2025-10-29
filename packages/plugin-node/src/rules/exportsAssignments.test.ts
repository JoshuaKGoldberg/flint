import rule from "./exportsAssignments.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
exports = {};
`,
			snapshot: `
exports = {};
~~~~~~~
Unexpected assignment to \`exports\`. Use \`module.exports\` instead.
`,
		},
		{
			code: `
exports = { foo: 1 };
`,
			snapshot: `
exports = { foo: 1 };
~~~~~~~
Unexpected assignment to \`exports\`. Use \`module.exports\` instead.
`,
		},
		{
			code: `
exports = somethingElse;
`,
			snapshot: `
exports = somethingElse;
~~~~~~~
Unexpected assignment to \`exports\`. Use \`module.exports\` instead.
`,
		},
	],
	valid: [
		`module.exports.foo = 1;`,
		`exports.bar = 2;`,
		`module.exports = {};`,
		`module.exports = exports = {};`,
		`exports = module.exports = {};`,
		`function f(exports) { exports = {}; }`,
		`let exports; exports = {};`,
	],
});
