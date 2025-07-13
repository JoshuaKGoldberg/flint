import rule from "./explicitModuleBoundaryTypes.js";
import { ruleTester } from "./ruleTester.js";

const valid = [
	`
    export function foo(bar: string): string {
        return bar;
    }`,
	`
    function notExported(bar: string) {
        return bar;
    }`,
	`export const CONSTANT = 1;`,
	`export const MyComponent: React.FC = props => null`,
	// classes
	`export class C {}`,
	`export class C { constructor() {} }`,
	// non-exported classes do not need to be typed
	`class C { public a; constructor(a) { this.a = a; } }`,
	// public, well-typed members
	`export class C { public a: number }`,
	`export class C { foo(): void {} }`,
	`export class C { public foo(): void {} }`,
	`export class C { public foo(): void {} }`,
	// private members do not need to be typed
	// todo: what about protected members?
	`export class C { private a }`,
	`export class C { #a }`,
	`export class C { private foo(a) { return a } }`,
	`export class C { private a; }`,
	`export class C {
        #a: number
        constructor(a: number) {
            this.#a = a;
        }
    }`,
	`export class C {
        #a: number
        private constructor(a) {
            this.#a = a;
        }
    }`,
	// namespaces
	`
    export namespace Foo {
        export function foo(a: number): number {
            return a;
        }
    }`,
	`
    namespace Foo {
        export function foo(a: number) {
            return a;
        }
    }`,
];

const invalid = [
	{
		code: `
            export function foo(bar: string) {
                return bar;
            }
            `,
		output: `
            export function foo(bar: string): string {
                return bar;
            }
            `,
		snapshot: `
            export function foo(bar: string) {
                           ~~~
                           Public facing functions should have an explicit return type.
                return bar;
            }
            `,
	},
	{
		code: `
            export function foo(bar): string {
                return bar;
            }
            `,
		output: `
            export function foo(bar): string {
                return bar;
            }
            `,
		snapshot: `
            export function foo(bar): string {
                               ~~~
                               Public facing functions should have explicit types for all parameters.
                return bar;
            }
            `,
	},
	{
		code: `
    export const foo = () => 1;
    `,
		output: `
    export const foo = (): number => 1;
    `,
		snapshot: `
    export const foo = () => 1;
                ~~~
                Public facing functions should have an explicit return type.
    `,
	},
	// public constructors must be typed
	{
		code: `export class C { #a: number; constructor(a) { this.#a = a } }`,
		output: `export class C { #a: number; constructor(a) { this.#a = a } }`,
		snapshot: `export class C { #a: number; constructor(a) { this.#a = a } }`, // todo
	},
	// namespaces
	{
		code: `
        export namespace Foo {
            export function foo(a: number) {
                return a;
            }
        }`,
		output: `
        export namespace Foo {
            export function foo(a: number): number {
                return a;
            }
        }`,
		snapshot: `
        export namespace Foo {
            export function foo(a: number) {
                           ~~~
                           Public facing functions should have an explicit return type.
                return a;
            }
        }`,
	},
];
ruleTester.describe(rule, {
	invalid,
	valid,
});
