import rule from "./anyArguments.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
declare const value: any;
declare function fn(arg: string): void;
fn(value);
`,
			snapshot: `
declare const value: any;
declare function fn(arg: string): void;
fn(value);
   ~~~~~
   Unsafe argument of type \`any\` assigned to parameter of type \`string\`.
`,
		},
		{
			code: `
declare const values: any[];
declare function fn(arg: string): void;
fn(values[0]);
`,
			snapshot: `
declare const values: any[];
declare function fn(arg: string): void;
fn(values[0]);
   ~~~~~~~~~
   Unsafe argument of type \`any\` assigned to parameter of type \`string\`.
`,
		},
		{
			code: `
declare const value: any;
declare function fn(a: string, b: number): void;
fn("safe", value);
`,
			snapshot: `
declare const value: any;
declare function fn(a: string, b: number): void;
fn("safe", value);
           ~~~~~
           Unsafe argument of type \`any\` assigned to parameter of type \`number\`.
`,
		},
		{
			code: `
declare const values: any[];
declare function fn(...args: string[]): void;
fn(...values);
`,
			snapshot: `
declare const values: any[];
declare function fn(...args: string[]): void;
fn(...values);
   ~~~~~~~~~
   Unsafe spread of type \`any[]\` in function call.
`,
		},
		{
			code: `
declare const value: any;
new Set<string>(value);
`,
			snapshot: `
declare const value: any;
new Set<string>(value);
                ~~~~~
                Unsafe argument of type \`any\` assigned to parameter of type \`Iterable<string> | null | undefined\`.
`,
		},
	],
	valid: [
		`declare function fn(arg: string): void; fn("safe");`,
		`declare function fn(arg: number): void; fn(42);`,
		`declare function fn(arg: unknown): void; declare const x: any; fn(x);`,
		`declare function fn(arg: any): void; declare const x: any; fn(x);`,
		`declare function fn(...args: unknown[]): void; declare const x: any[]; fn(...x);`,
		`const arr = [1, 2, 3]; Math.max(...arr);`,
		`declare const obj: { name: string }; console.log(obj.name);`,
	],
});
