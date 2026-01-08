import rule from "./classMethodsThis.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
class Example {
    getValue() {
        return 42;
    }
}
`,
			snapshot: `
class Example {
    getValue() {
    ~~~~~~~~~~~~
    This method does not use \`this\` and could be a static method or a standalone function.
        return 42;
        ~~~~~~~~~~
    }
    ~
}
`,
		},
		{
			code: `
class Example {
    add(a: number, b: number) {
        return a + b;
    }
}
`,
			snapshot: `
class Example {
    add(a: number, b: number) {
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    This method does not use \`this\` and could be a static method or a standalone function.
        return a + b;
        ~~~~~~~~~~~~~
    }
    ~
}
`,
		},
		{
			code: `
class Example {
    format(value: string) {
        return value.toUpperCase();
    }
}
`,
			snapshot: `
class Example {
    format(value: string) {
    ~~~~~~~~~~~~~~~~~~~~~~~
    This method does not use \`this\` and could be a static method or a standalone function.
        return value.toUpperCase();
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
    ~
}
`,
		},
		{
			code: `
class Example {
    log() {
        console.log("hello");
    }
}
`,
			snapshot: `
class Example {
    log() {
    ~~~~~~~
    This method does not use \`this\` and could be a static method or a standalone function.
        console.log("hello");
        ~~~~~~~~~~~~~~~~~~~~~
    }
    ~
}
`,
		},
	],
	valid: [
		`class Example { getValue() { return this.value; } }`,
		`class Example { setValue(value: number) { this.value = value; } }`,
		`class Example { static getValue() { return 42; } }`,
		`class Example { constructor() {} }`,
		`class Example { method(): void; method(arg: string): void; method(arg?: string) { console.log(this); } }`,
		`class Base { method() { return this.value; } } class Derived extends Base { override method() { return 2; } }`,
		`class Example { getValue() { const inner = () => this.value; return inner(); } }`,
	],
});
