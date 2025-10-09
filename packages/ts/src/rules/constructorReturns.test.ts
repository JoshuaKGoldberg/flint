import rule from "./constructorReturns.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
class A {
    constructor() {
        return 1;
    }
}
`,
			snapshot: `
class A {
    constructor() {
        return 1;
        ~~~~~~
        Constructors should not return values other than \`this\` or \`undefined\`.
    }
}
`,
		},
		{
			code: `
class B {
    constructor() {
        return {};
    }
}
`,
			snapshot: `
class B {
    constructor() {
        return {};
        ~~~~~~
        Constructors should not return values other than \`this\` or \`undefined\`.
    }
}
`,
		},
		{
			code: `
class C {
    constructor() {
        return "value";
    }
}
`,
			snapshot: `
class C {
    constructor() {
        return "value";
        ~~~~~~
        Constructors should not return values other than \`this\` or \`undefined\`.
    }
}
`,
		},
		{
			code: `
class D {
    constructor() {
        if (condition) {
            return null;
        }
    }
}
`,
			snapshot: `
class D {
    constructor() {
        if (condition) {
            return null;
            ~~~~~~
            Constructors should not return values other than \`this\` or \`undefined\`.
        }
    }
}
`,
		},
		{
			code: `
class E {
    constructor() {
        return this.value;
    }
}
`,
			snapshot: `
class E {
    constructor() {
        return this.value;
        ~~~~~~
        Constructors should not return values other than \`this\` or \`undefined\`.
    }
}
`,
		},
	],
	valid: [
		`class A { constructor() {} }`,
		`class B { constructor() { return; } }`,
		`class C { constructor() { if (condition) { return; } } }`,
		`class D { method() { return 1; } }`,
		`function factory() { return {}; }`,
		`const arrowFn = () => { return 1; };`,
		`
class E {
    constructor() {
        const fn = () => {
            return 1;
        };
    }
}
`,
		`
class F {
    constructor() {
        function helper() {
            return 1;
        }
    }
}
`,
	],
});
