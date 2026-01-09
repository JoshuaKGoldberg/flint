import rule from "./constructorSupers.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
class Child extends Parent {
    constructor() {
    }
}
`,
			snapshot: `
class Child extends Parent {
    constructor() {
    ~~~~~~~~~~~~~~
    Derived classes must call super() in their constructor.
    }
}
`,
		},
		{
			code: `
class Child extends Parent {
    constructor(value: number) {
        this.value = value;
    }
}
`,
			snapshot: `
class Child extends Parent {
    constructor(value: number) {
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Derived classes must call super() in their constructor.
        this.value = value;
    }
}
`,
		},
		{
			code: `
class Example {
    constructor() {
        super();
    }
}
`,
			snapshot: `
class Example {
    constructor() {
        super();
        ~~~~~~~
        Non-derived classes should not call super() in their constructor.
    }
}
`,
		},
		{
			code: `
class Example {
    constructor(value: number) {
        super(value);
        this.value = value;
    }
}
`,
			snapshot: `
class Example {
    constructor(value: number) {
        super(value);
        ~~~~~~~~~~~~
        Non-derived classes should not call super() in their constructor.
        this.value = value;
    }
}
`,
		},
	],
	valid: [
		`class Example { constructor() {} }`,
		`class Example { constructor() { this.value = 1; } }`,
		`class Child extends Parent { constructor() { super(); } }`,
		`class Child extends Parent { constructor(value: number) { super(value); this.value = value; } }`,
		`class Child extends Parent { constructor() { super(); const fn = () => {}; } }`,
		`class GrandChild extends Child { constructor() { super(); } }`,
		`class Example { constructor() { const nested = class extends Base { constructor() { super(); } }; } }`,
	],
});
