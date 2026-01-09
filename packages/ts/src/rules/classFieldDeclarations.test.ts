import rule from "./classFieldDeclarations.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
class Example {
    constructor() {
        this.value = "hello";
    }
}
`,
			snapshot: `
class Example {
    constructor() {
        this.value = "hello";
        ~~~~~~~~~~~~~~~~~~~~~
        Prefer declaring this property as a class field instead of assigning in the constructor.
    }
}
`,
		},
		{
			code: `
class Example {
    constructor() {
        this.count = 42;
    }
}
`,
			snapshot: `
class Example {
    constructor() {
        this.count = 42;
        ~~~~~~~~~~~~~~~~
        Prefer declaring this property as a class field instead of assigning in the constructor.
    }
}
`,
		},
		{
			code: `
class Example {
    constructor() {
        this.enabled = true;
    }
}
`,
			snapshot: `
class Example {
    constructor() {
        this.enabled = true;
        ~~~~~~~~~~~~~~~~~~~~
        Prefer declaring this property as a class field instead of assigning in the constructor.
    }
}
`,
		},
		{
			code: `
class Example {
    constructor() {
        this.disabled = false;
    }
}
`,
			snapshot: `
class Example {
    constructor() {
        this.disabled = false;
        ~~~~~~~~~~~~~~~~~~~~~~
        Prefer declaring this property as a class field instead of assigning in the constructor.
    }
}
`,
		},
		{
			code: `
class Example {
    constructor() {
        this.items = [];
    }
}
`,
			snapshot: `
class Example {
    constructor() {
        this.items = [];
        ~~~~~~~~~~~~~~~~
        Prefer declaring this property as a class field instead of assigning in the constructor.
    }
}
`,
		},
		{
			code: `
class Example {
    constructor() {
        this.config = {};
    }
}
`,
			snapshot: `
class Example {
    constructor() {
        this.config = {};
        ~~~~~~~~~~~~~~~~~
        Prefer declaring this property as a class field instead of assigning in the constructor.
    }
}
`,
		},
		{
			code: `
class Example {
    constructor() {
        this.template = \`hello world\`;
    }
}
`,
			snapshot: `
class Example {
    constructor() {
        this.template = \`hello world\`;
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Prefer declaring this property as a class field instead of assigning in the constructor.
    }
}
`,
		},
		{
			code: `
class MyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MyError";
    }
}
`,
			snapshot: `
class MyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MyError";
        ~~~~~~~~~~~~~~~~~~~~~~
        Prefer declaring this property as a class field instead of assigning in the constructor.
    }
}
`,
		},
		{
			code: `
class Example {
    constructor() {
        this.data = { key: "value", count: 1 };
    }
}
`,
			snapshot: `
class Example {
    constructor() {
        this.data = { key: "value", count: 1 };
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Prefer declaring this property as a class field instead of assigning in the constructor.
    }
}
`,
		},
		{
			code: `
class Example {
    constructor() {
        this.numbers = [1, 2, 3];
    }
}
`,
			snapshot: `
class Example {
    constructor() {
        this.numbers = [1, 2, 3];
        ~~~~~~~~~~~~~~~~~~~~~~~~~
        Prefer declaring this property as a class field instead of assigning in the constructor.
    }
}
`,
		},
	],
	valid: [
		`class Example { value = "hello"; }`,
		`class Example { count = 42; }`,
		`class Example { enabled = true; }`,
		`class Example { items: string[] = []; }`,
		`class Example { constructor(value: string) { this.value = value; } }`,
		`class Example { constructor() { this.value = getValue(); } }`,
		`class Example { constructor() { this.value = someVariable; } }`,
		`class Example { constructor() { const value = "hello"; } }`,
		`class Example { value = "default"; constructor() { this.value = "override"; } }`,
		`class Example { constructor() { this.computed = 1 + 2; } }`,
		`class Example { constructor() { this.reference = this.other; } }`,
	],
});
