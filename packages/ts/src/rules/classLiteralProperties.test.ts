import rule from "./classLiteralProperties.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
class Example {
    get value() {
        return "hello";
    }
}
`,
			snapshot: `
class Example {
    get value() {
    ~~~~~~~~~~~~~
    Prefer declaring this literal value as a readonly field instead of a getter.
        return "hello";
        ~~~~~~~~~~~~~~~
    }
    ~
}
`,
		},
		{
			code: `
class Example {
    get count() {
        return 42;
    }
}
`,
			snapshot: `
class Example {
    get count() {
    ~~~~~~~~~~~~~
    Prefer declaring this literal value as a readonly field instead of a getter.
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
    get enabled() {
        return true;
    }
}
`,
			snapshot: `
class Example {
    get enabled() {
    ~~~~~~~~~~~~~~~
    Prefer declaring this literal value as a readonly field instead of a getter.
        return true;
        ~~~~~~~~~~~~
    }
    ~
}
`,
		},
		{
			code: `
class Example {
    get disabled() {
        return false;
    }
}
`,
			snapshot: `
class Example {
    get disabled() {
    ~~~~~~~~~~~~~~~~
    Prefer declaring this literal value as a readonly field instead of a getter.
        return false;
        ~~~~~~~~~~~~~
    }
    ~
}
`,
		},
		{
			code: `
class Example {
    get empty() {
        return null;
    }
}
`,
			snapshot: `
class Example {
    get empty() {
    ~~~~~~~~~~~~~
    Prefer declaring this literal value as a readonly field instead of a getter.
        return null;
        ~~~~~~~~~~~~
    }
    ~
}
`,
		},
		{
			code: `
class Example {
    get pattern() {
        return /test/;
    }
}
`,
			snapshot: `
class Example {
    get pattern() {
    ~~~~~~~~~~~~~~~
    Prefer declaring this literal value as a readonly field instead of a getter.
        return /test/;
        ~~~~~~~~~~~~~~
    }
    ~
}
`,
		},
		{
			code: `
class Example {
    get bigNumber() {
        return 9007199254740991n;
    }
}
`,
			snapshot: `
class Example {
    get bigNumber() {
    ~~~~~~~~~~~~~~~~~
    Prefer declaring this literal value as a readonly field instead of a getter.
        return 9007199254740991n;
        ~~~~~~~~~~~~~~~~~~~~~~~~~
    }
    ~
}
`,
		},
		{
			code: `
class Example {
    get template() {
        return \`hello\`;
    }
}
`,
			snapshot: `
class Example {
    get template() {
    ~~~~~~~~~~~~~~~~
    Prefer declaring this literal value as a readonly field instead of a getter.
        return \`hello\`;
        ~~~~~~~~~~~~~~~
    }
    ~
}
`,
		},
	],
	valid: [
		`class Example { readonly value = "hello"; }`,
		`class Example { readonly count = 42; }`,
		`class Example { readonly enabled = true; }`,
		`class Example { get computed() { return this.a + this.b; } }`,
		`class Example { get dynamic() { return getValue(); } }`,
		`class Example { get items() { return []; } }`,
		`class Example { get config() { return {}; } }`,
		`class Example { get handler() { return () => {}; } }`,
		`class Example { get value() { console.log("accessed"); return "hello"; } }`,
	],
});
