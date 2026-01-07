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
	],
});
