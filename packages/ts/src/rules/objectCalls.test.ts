import rule from "./objectCalls.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const value = new Object();
`,
			snapshot: `
const value = new Object();
              ~~~
              Use object literal notation {} or Object.create instead of calling Object as a constructor.
`,
		},
		{
			code: `
const empty = new Object();
const filled = new Object({ key: "value" });
`,
			snapshot: `
const empty = new Object();
              ~~~
              Use object literal notation {} or Object.create instead of calling Object as a constructor.
const filled = new Object({ key: "value" });
               ~~~
               Use object literal notation {} or Object.create instead of calling Object as a constructor.
`,
		},
		{
			code: `
function createObject() {
    return new Object();
}
`,
			snapshot: `
function createObject() {
    return new Object();
           ~~~
           Use object literal notation {} or Object.create instead of calling Object as a constructor.
}
`,
		},
		{
			code: `
const config = condition ? new Object() : { default: true };
`,
			snapshot: `
const config = condition ? new Object() : { default: true };
                           ~~~
                           Use object literal notation {} or Object.create instead of calling Object as a constructor.
`,
		},
		{
			code: `
const array = [new Object(), new Object()];
`,
			snapshot: `
const array = [new Object(), new Object()];
               ~~~
               Use object literal notation {} or Object.create instead of calling Object as a constructor.
                             ~~~
                             Use object literal notation {} or Object.create instead of calling Object as a constructor.
`,
		},
		{
			code: `
const nested = { inner: new Object() };
`,
			snapshot: `
const nested = { inner: new Object() };
                        ~~~
                        Use object literal notation {} or Object.create instead of calling Object as a constructor.
`,
		},
		{
			code: `
processData(new Object());
`,
			snapshot: `
processData(new Object());
            ~~~
            Use object literal notation {} or Object.create instead of calling Object as a constructor.
`,
		},
	],
	valid: [
		`const value = {};`,
		`const filled = { key: "value" };`,
		`const proto = Object.create(null);`,
		`const inherited = Object.create(prototype);`,
		`const assigned = Object.assign({}, source);`,
		`const entries = Object.entries(data);`,
		`const keys = Object.keys(data);`,
		`const values = Object.values(data);`,
		`function createEmpty() { return {}; }`,
		`const array = [{}, { key: "value" }];`,
		`const nested = { inner: {} };`,
		`processData({});`,
	],
});
