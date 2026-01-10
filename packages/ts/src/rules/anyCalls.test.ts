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
		// Edge case: optional chaining on any
		{
			code: `
declare const value: any;
value?.();
`,
			snapshot: `
declare const value: any;
value?.();
~~~~~
Unsafe call of \`any\` typed value.
`,
		},
		// Edge case: deep property chain with optional chaining
		{
			code: `
declare const value: any;
value.a.b.c.d.e.f.g?.();
`,
			snapshot: `
declare const value: any;
value.a.b.c.d.e.f.g?.();
~~~~~~~~~~~~~~~~~~~
Unsafe call of \`any\` typed value.
`,
		},
		// Edge case: property that is typed as any
		{
			code: `
declare const obj: { a: any };
obj.a();
`,
			snapshot: `
declare const obj: { a: any };
obj.a();
~~~~~
Unsafe call of \`any\` typed value.
`,
		},
		// Edge case: optional chaining on object with any property
		{
			code: `
declare const obj: { a: any } | undefined;
obj?.a();
`,
			snapshot: `
declare const obj: { a: any } | undefined;
obj?.a();
~~~~~~
Unsafe call of \`any\` typed value.
`,
		},
		// Edge case: template tag on nested property with any
		{
			code: `
declare const obj: { tag: any };
obj.tag\`template\`;
`,
			snapshot: `
declare const obj: { tag: any };
obj.tag\`template\`;
~~~~~~~
Unsafe use of \`any\` typed template tag.
`,
		},
		// Edge case: new expression on nested property with any
		{
			code: `
declare const obj: { Ctor: any };
new obj.Ctor();
`,
			snapshot: `
declare const obj: { Ctor: any };
new obj.Ctor();
    ~~~~~~~~
    Unsafe construction of \`any\` typed value.
`,
		},
		// Edge case: interface extends Function without signatures (construction)
		{
			code: `
interface UnsafeFunction extends Function {}
declare const value: UnsafeFunction;
new value();
`,
			snapshot: `
interface UnsafeFunction extends Function {}
declare const value: UnsafeFunction;
new value();
    ~~~~~
    Unsafe construction of \`Function\` typed value.
`,
		},
		// Edge case: interface extends Function without signatures (template tag)
		{
			code: `
interface UnsafeFunction extends Function {}
declare const value: UnsafeFunction;
value\`template\`;
`,
			snapshot: `
interface UnsafeFunction extends Function {}
declare const value: UnsafeFunction;
value\`template\`;
~~~~~
Unsafe use of \`Function\` typed template tag.
`,
		},
		// Edge case: interface extends Function with only void call signature (construction is unsafe)
		{
			code: `
interface UnsafeToConstruct extends Function {
    (): void;
}
declare const value: UnsafeToConstruct;
new value();
`,
			snapshot: `
interface UnsafeToConstruct extends Function {
    (): void;
}
declare const value: UnsafeToConstruct;
new value();
    ~~~~~
    Unsafe construction of \`Function\` typed value.
`,
		},
		// Edge case: interface extends Function with property but no signatures
		{
			code: `
interface StillUnsafe extends Function {
    property: string;
}
declare const value: StillUnsafe;
value();
`,
			snapshot: `
interface StillUnsafe extends Function {
    property: string;
}
declare const value: StillUnsafe;
value();
~~~~~
Unsafe call of \`Function\` typed value.
`,
		},
		// Edge case: error type (unresolved)
		{
			code: `
let value: NotKnown;
value();
`,
			snapshot: `
let value: NotKnown;
value();
~~~~~
Unsafe call of \`error\` typed value.
`,
		},
		// Edge case: template tag on error type
		{
			code: `
let value: NotKnown;
value\`template\`;
`,
			snapshot: `
let value: NotKnown;
value\`template\`;
~~~~~
Unsafe use of \`error\` typed template tag.
`,
		},
		// Edge case: new expression on error type
		{
			code: `
let value: NotKnown;
new value();
`,
			snapshot: `
let value: NotKnown;
new value();
    ~~~~~
    Unsafe construction of \`error\` typed value.
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
		// Edge case: optional chaining on typed function
		`
declare const obj: { a?: () => void };
obj.a?.();
`,
		// Edge case: String.raw is valid (built-in)
		`String.raw\`template\`;`,
		// Edge case: new Function() is valid (global Function constructor)
		`new Function('return 1');`,
		// Edge case: Function() is valid (global Function constructor call)
		`Function('return 1');`,
		// Edge case: local shadowed Function type
		`
{
    type Function = () => void;
    const notGlobalFunction: Function = (() => {}) as Function;
    notGlobalFunction();
}
`,
		// Edge case: interface extending Function with call signature (safe)
		`
interface SafeFunction extends Function {
    (): string;
}
declare const safe: SafeFunction;
safe();
`,
		// Edge case: interface extending Function with construct signature (safe for construction)
		`
interface ConstructSignatureMakesSafe extends Function {
    new (): ConstructSignatureMakesSafe;
}
declare const safe: ConstructSignatureMakesSafe;
new safe();
`,
		// Edge case: interface with mixed void/non-void signatures (non-void makes construction safe)
		`
interface SafeWithNonVoidCallSignature extends Function {
    (): void;
    (x: string): string;
}
declare const safe: SafeWithNonVoidCallSignature;
new safe();
`,
		// Edge case: template tag on interface with call signature
		`
interface SafeTemplateTag extends Function {
    (strings: TemplateStringsArray): string;
}
declare const tag: SafeTemplateTag;
tag\`template\`;
`,
	],
});
