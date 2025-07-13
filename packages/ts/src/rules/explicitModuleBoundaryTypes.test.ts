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
		code: `export const foo = () => 1;`,
		output: `export const foo = (): number => 1;`,
		snapshot: `export const foo = () => 1;`,
	},
];
ruleTester.describe(rule, {
	invalid,
	valid,
});
