import rule from "./classMethodsThis.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
class Example {
    method() {
        return 1;
    }
}
`,
			snapshot: `
class Example {
    method() {
    ~~~~~~
    Method does not use \`this\` and could be made static.
        return 1;
    }
}
`,
		},
		{
			code: `
class Example {
    getValue() {
        const x = 5;
        return x * 2;
    }
}
`,
			snapshot: `
class Example {
    getValue() {
    ~~~~~~~~
    Method does not use \`this\` and could be made static.
        const x = 5;
        return x * 2;
    }
}
`,
		},
		{
			code: `
class Example {
    calculate(a: number, b: number) {
        return a + b;
    }
}
`,
			snapshot: `
class Example {
    calculate(a: number, b: number) {
    ~~~~~~~~~
    Method does not use \`this\` and could be made static.
        return a + b;
    }
}
`,
		},
		{
			code: `
class Example {
    greet() {
        console.log("hello");
    }
}
`,
			snapshot: `
class Example {
    greet() {
    ~~~~~
    Method does not use \`this\` and could be made static.
        console.log("hello");
    }
}
`,
		},
		{
			code: `
class Example {
    method() {
        const arrow = () => { return this.value; };
        return 1;
    }
}
`,
			snapshot: `
class Example {
    method() {
    ~~~~~~
    Method does not use \`this\` and could be made static.
        const arrow = () => { return this.value; };
        return 1;
    }
}
`,
		},
	],
	valid: [
		`class Example { method() { return this.value; } }`,
		`class Example { method() { this.doSomething(); } }`,
		`class Example { static method() { return 1; } }`,
		`class Example { constructor() { this.value = 1; } }`,
		`class Example { get value() { return 1; } }`,
		`class Example { set value(v) { this._value = v; } }`,
		`abstract class Example { abstract method(): void; }`,
		`class Child extends Parent { override method() { return 1; } }`,
		`class Example { method() { return super.method(); } }`,
		`class Example { method() { const fn = function() { return this; }; return this.value; } }`,
	],
});
