import rule from "./destructuringConsistency.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const obj = { a: 1, b: 2 };
const { a } = obj;
console.log(obj.a);
`,
			snapshot: `
const obj = { a: 1, b: 2 };
const { a } = obj;
console.log(obj.a);
            ~~~~~
            Use the destructured variable instead of accessing the property again.
`,
		},
		{
			code: `
const data = { name: "test", value: 10 };
const { name, value } = data;
console.log(data.name);
`,
			snapshot: `
const data = { name: "test", value: 10 };
const { name, value } = data;
console.log(data.name);
            ~~~~~~~~~
            Use the destructured variable instead of accessing the property again.
`,
		},
		{
			code: `
const config = { port: 3000, host: "localhost" };
const { port } = config;
const url = config.host + ":" + config.port;
`,
			snapshot: `
const config = { port: 3000, host: "localhost" };
const { port } = config;
const url = config.host + ":" + config.port;
                                ~~~~~~~~~~~
                                Use the destructured variable instead of accessing the property again.
`,
		},
	],
	valid: [
		"const obj = { a: 1, b: 2 }; const { a } = obj; console.log(a);",
		"const obj = { a: 1, b: 2 }; const { a } = obj; console.log(obj.b);",
		"const obj = { a: 1, b: 2 }; console.log(obj.a);",
		"const obj = { method: () => {} }; const { method } = obj; obj.method();",
		"const arr = [1, 2, 3]; const [first] = arr; console.log(arr[0]);",
	],
});
