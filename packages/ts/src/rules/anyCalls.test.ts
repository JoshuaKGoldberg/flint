import rule from "./anyCalls.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
declare const value: any;
value();
`,
			snapshot: `
declare const value: any;
value();
~~~~~
Unsafe call of \`any\` typed value.
`,
		},
		{
			code: `
declare const value: any;
value.property();
`,
			snapshot: `
declare const value: any;
value.property();
~~~~~~~~~~~~~~
Unsafe call of \`any\` typed value.
`,
		},
		{
			code: `
declare const value: any;
value.property.nested();
`,
			snapshot: `
declare const value: any;
value.property.nested();
~~~~~~~~~~~~~~~~~~~~~
Unsafe call of \`any\` typed value.
`,
		},
		{
			code: `
declare const value: any;
value["property"]();
`,
			snapshot: `
declare const value: any;
value["property"]();
~~~~~~~~~~~~~~~~~
Unsafe call of \`any\` typed value.
`,
		},
		{
			code: `
declare const value: any;
new value();
`,
			snapshot: `
declare const value: any;
new value();
    ~~~~~
    Unsafe construction of \`any\` typed value.
`,
		},
		{
			code: `
declare const value: any;
value\`template\`;
`,
			snapshot: `
declare const value: any;
value\`template\`;
~~~~~
Unsafe use of \`any\` typed template tag.
`,
		},
		{
			code: `
declare const value: Function;
value();
`,
			snapshot: `
declare const value: Function;
value();
~~~~~
Unsafe call of \`Function\` typed value.
`,
		},
		{
			code: `
declare const value: Function;
new value();
`,
			snapshot: `
declare const value: Function;
new value();
    ~~~~~
    Unsafe construction of \`Function\` typed value.
`,
		},
		{
			code: `
declare const value: Function;
value\`template\`;
`,
			snapshot: `
declare const value: Function;
value\`template\`;
~~~~~
Unsafe use of \`Function\` typed template tag.
`,
		},
		{
			code: `
interface UnsafeFunction extends Function {}
declare const value: UnsafeFunction;
value();
`,
			snapshot: `
interface UnsafeFunction extends Function {}
declare const value: UnsafeFunction;
value();
~~~~~
Unsafe call of \`Function\` typed value.
`,
		},
		{
			code: `
const createValue = () => Math as any;
createValue()();
`,
			snapshot: `
const createValue = () => Math as any;
createValue()();
~~~~~~~~~~~~~
Unsafe call of \`any\` typed value.
`,
		},
		{
			code: `
declare const value: unknown;
if (typeof value === "function") {
    value();
}
`,
			snapshot: `
declare const value: unknown;
if (typeof value === "function") {
    value();
    ~~~~~
    Unsafe call of \`Function\` typed value.
}
`,
		},
	],
	valid: [
		`
declare function value(): void;
value();
`,
		`
declare const value: () => void;
value();
`,
		`
declare const object: { method(): void };
object.method();
`,
		`
declare class Constructor {}
new Constructor();
`,
		`
const tag = (strings: TemplateStringsArray, ...values: unknown[]) => strings[0];
tag\`template\`;
`,

		`
interface SafeFunction extends Function {
    (): void;
}
declare const value: SafeFunction;
value();
`,
		`
type Constructable = new () => object;
declare const value: Constructable;
new value();
`,
		`
declare const map: Map<string, number>;
map.get("key");
`,
		`(() => {})();`,
		`new Map<string, string>();`,
		`
interface Callable extends Function {
    new (): object;
}
declare const value: Callable;
new value();
`,
	],
});
