import rule from "./functionTypeDeclarations.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
interface Foo {
    (): string;
}
`,
			snapshot: `
interface Foo {
    (): string;
    ~~~~~~~~~~~
    Interface only has a call signature. Use a function type instead.
}
`,
		},
		{
			code: `
interface Foo {
    (value: string): number;
}
`,
			snapshot: `
interface Foo {
    (value: string): number;
    ~~~~~~~~~~~~~~~~~~~~~~~~
    Interface only has a call signature. Use a function type instead.
}
`,
		},
		{
			code: `
type Foo = {
    (): void;
};
`,
			snapshot: `
type Foo = {
    (): void;
    ~~~~~~~~~
    Type literal only has a call signature. Use a function type instead.
};
`,
		},
		{
			code: `
type Foo = {
    (value: number): string;
};
`,
			snapshot: `
type Foo = {
    (value: number): string;
    ~~~~~~~~~~~~~~~~~~~~~~~~
    Type literal only has a call signature. Use a function type instead.
};
`,
		},
		{
			code: `
interface Bar extends Function {
    (): void;
}
`,
			snapshot: `
interface Bar extends Function {
    (): void;
    ~~~~~~~~~
    Interface only has a call signature. Use a function type instead.
}
`,
		},
	],
	valid: [
		`type Foo = () => string;`,
		`type Foo = (value: string) => number;`,
		`
interface Foo {
    (): string;
    property: number;
}
`,
		`
interface Foo {
    (): string;
    (value: number): string;
}
`,
		`
type Foo = {
    (): string;
    property: number;
};
`,
		`
interface Foo extends Bar {
    (): void;
}
`,
		`
interface Foo extends Bar, Baz {
    (): void;
}
`,
		`
interface Foo {
    new (): Foo;
}
`,
		`
type Foo = {
    new (): Foo;
};
`,
	],
});
