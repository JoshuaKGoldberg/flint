import rule from "./anyMemberAccess.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
declare const value: any;
value.property;
`,
			snapshot: `
declare const value: any;
value.property;
      ~~~~~~~~
      Unsafe member access on \`any\` typed value.
`,
		},
		{
			code: `
declare const value: any;
value["property"];
`,
			snapshot: `
declare const value: any;
value["property"];
      ~~~~~~~~~~
      Unsafe member access on \`any\` typed value.
`,
		},
		{
			code: `
declare const value: any;
value.a.b.c;
`,
			snapshot: `
declare const value: any;
value.a.b.c;
      ~
      Unsafe member access on \`any\` typed value.
`,
		},
		{
			code: `
declare const value: any;
value[0];
`,
			snapshot: `
declare const value: any;
value[0];
      ~
      Unsafe member access on \`any\` typed value.
`,
		},
		{
			code: `
declare const obj: { a: number };
declare const key: any;
obj[key];
`,
			snapshot: `
declare const obj: { a: number };
declare const key: any;
obj[key];
    ~~~
    Computed key is \`any\` typed.
`,
		},
		{
			code: `
declare function getKey(): any;
declare const obj: { a: number };
obj[getKey()];
`,
			snapshot: `
declare function getKey(): any;
declare const obj: { a: number };
obj[getKey()];
    ~~~~~~~~
    Computed key is \`any\` typed.
`,
		},
		{
			code: `
declare const value: any;
value?.property;
`,
			snapshot: `
declare const value: any;
value?.property;
       ~~~~~~~~
       Unsafe member access on \`any\` typed value.
`,
		},
		// Edge case: deep property chain with optional chaining
		{
			code: `
declare const value: any;
value.a.b.c.d.e.f.g;
`,
			snapshot: `
declare const value: any;
value.a.b.c.d.e.f.g;
      ~
      Unsafe member access on \`any\` typed value.
`,
		},
		// Edge case: property that is any in typed object
		{
			code: `
declare const obj: { a: any };
obj.a.b;
`,
			snapshot: `
declare const obj: { a: any };
obj.a.b;
      ~
      Unsafe member access on \`any\` typed value.
`,
		},
		// Edge case: nested any property access
		{
			code: `
declare const obj: { nested: { prop: any } };
obj.nested.prop.value;
`,
			snapshot: `
declare const obj: { nested: { prop: any } };
obj.nested.prop.value;
                ~~~~~
                Unsafe member access on \`any\` typed value.
`,
		},
		// Edge case: computed access with any type assertion
		{
			code: `
declare const arr: string[];
arr[1 as any];
`,
			snapshot: `
declare const arr: string[];
arr[1 as any];
    ~~~~~~~~
    Computed key is \`any\` typed.
`,
		},
		// Edge case: error type (unresolved type)
		{
			code: `
let value: NotKnown;
value.property;
`,
			snapshot: `
let value: NotKnown;
value.property;
      ~~~~~~~~
      Unsafe member access on \`error\` typed value.
`,
		},
		// Edge case: error type for computed key
		{
			code: `
declare const obj: { a: number };
let key: NotKnown;
obj[key];
`,
			snapshot: `
declare const obj: { a: number };
let key: NotKnown;
obj[key];
    ~~~
    Computed key is \`error\` typed.
`,
		},
		// Edge case: optional chaining with element access
		{
			code: `
declare const value: any;
value?.[0];
`,
			snapshot: `
declare const value: any;
value?.[0];
        ~
        Unsafe member access on \`any\` typed value.
`,
		},
		// Edge case: mixed property and element access chain
		{
			code: `
declare const value: any;
value.a[0].b;
`,
			snapshot: `
declare const value: any;
value.a[0].b;
      ~
      Unsafe member access on \`any\` typed value.
`,
		},
		// Edge case: non-null assertion on any
		{
			code: `
declare const value: any;
value!.property;
`,
			snapshot: `
declare const value: any;
value!.property;
       ~~~~~~~~
       Unsafe member access on \`any\` typed value.
`,
		},
		// Edge case: parenthesized any expression
		{
			code: `
declare const value: any;
(value).property;
`,
			snapshot: `
declare const value: any;
(value).property;
        ~~~~~~~~
        Unsafe member access on \`any\` typed value.
`,
		},
		// Edge case: function call returning any, then accessing member
		{
			code: `
declare function getAny(): any;
getAny().property;
`,
			snapshot: `
declare function getAny(): any;
getAny().property;
         ~~~~~~~~
         Unsafe member access on \`any\` typed value.
`,
		},
		// Edge case: type assertion to any then member access
		{
			code: `
declare const value: string;
(value as any).property;
`,
			snapshot: `
declare const value: string;
(value as any).property;
               ~~~~~~~~
               Unsafe member access on \`any\` typed value.
`,
		},
		// Edge case: array destructuring from any
		{
			code: `
declare const arr: any;
arr[0].property;
`,
			snapshot: `
declare const arr: any;
arr[0].property;
    ~
    Unsafe member access on \`any\` typed value.
`,
		},
	],
	valid: [
		`
declare const value: { property: string };
value.property;
`,
		`
declare const value: { property: string };
value["property"];
`,
		`
declare const value: string[];
value[0];
`,
		`
declare const value: Record<string, number>;
value["key"];
`,
		`
declare const value: Record<string, number>;
declare const key: string;
value[key];
`,
		`
declare const value: unknown;
if (typeof value === "object" && value !== null && "property" in value) {
    (value as { property: string }).property;
}
`,
		`
declare const map: Map<string, number>;
map.get("key");
`,
		`const result = [1, 2, 3][0];`,
		// Edge case: deeply nested typed object
		`
declare const obj: { a: { b: { c: number } } };
obj.a.b.c;
`,
		// Edge case: optional chaining on typed value
		`
declare const obj: { a?: { b: number } };
obj.a?.b;
`,
		// Edge case: union type with undefined
		`
declare const obj: { property: string } | undefined;
obj?.property;
`,
		// Edge case: template literal key (string)
		`
declare const obj: Record<string, number>;
obj[\`key\`];
`,
		// Edge case: number literal as key
		`
declare const arr: number[];
arr[42];
`,
		// Edge case: typed function call result
		`
declare function getTyped(): { property: string };
getTyped().property;
`,
		// Edge case: class instance property access
		`
class MyClass {
    property = "value";
}
const instance = new MyClass();
instance.property;
`,
		// Edge case: interface with index signature
		`
interface StringMap {
    [key: string]: number;
}
declare const map: StringMap;
declare const key: string;
map[key];
`,
		// Edge case: tuple access
		`
declare const tuple: [string, number];
tuple[0];
tuple[1];
`,
	],
});
