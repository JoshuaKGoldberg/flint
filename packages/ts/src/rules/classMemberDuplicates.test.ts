import rule from "./classMemberDuplicates.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
class Foo {
    bar() {}
    bar() {}
}
`,
			snapshot: `
class Foo {
    bar() {}
    bar() {}
    ~~~
    Duplicate class member name 'bar' will be overwritten.
}
`,
		},
		{
			code: `
class Foo {
    bar;
    bar;
}
`,
			snapshot: `
class Foo {
    bar;
    bar;
    ~~~
    Duplicate class member name 'bar' will be overwritten.
}
`,
		},
		{
			code: `
class Foo {
    bar() {}
    bar;
}
`,
			snapshot: `
class Foo {
    bar() {}
    bar;
    ~~~
    Duplicate class member name 'bar' will be overwritten.
}
`,
		},
		{
			code: `
class Foo {
    get bar() { return 1; }
    get bar() { return 2; }
}
`,
			snapshot: `
class Foo {
    get bar() { return 1; }
    get bar() { return 2; }
        ~~~
        Duplicate class member name 'bar' will be overwritten.
}
`,
		},
		{
			code: `
class Foo {
    set bar(value: number) {}
    set bar(value: number) {}
}
`,
			snapshot: `
class Foo {
    set bar(value: number) {}
    set bar(value: number) {}
        ~~~
        Duplicate class member name 'bar' will be overwritten.
}
`,
		},
		{
			code: `
class Foo {
    static bar() {}
    static bar() {}
}
`,
			snapshot: `
class Foo {
    static bar() {}
    static bar() {}
           ~~~
           Duplicate class member name 'bar' will be overwritten.
}
`,
		},
		{
			code: `
class Foo {
    "bar"() {}
    "bar"() {}
}
`,
			snapshot: `
class Foo {
    "bar"() {}
    "bar"() {}
    ~~~~~
    Duplicate class member name 'bar' will be overwritten.
}
`,
		},
		{
			code: `
class Foo {
    123() {}
    123() {}
}
`,
			snapshot: `
class Foo {
    123() {}
    123() {}
    ~~~
    Duplicate class member name '123' will be overwritten.
}
`,
		},
		{
			code: `
class Foo {
    #bar() {}
    #bar() {}
}
`,
			snapshot: `
class Foo {
    #bar() {}
    #bar() {}
    ~~~~
    Duplicate class member name '#bar' will be overwritten.
}
`,
		},
		{
			code: `
const Foo = class {
    bar() {}
    bar() {}
};
`,
			snapshot: `
const Foo = class {
    bar() {}
    bar() {}
    ~~~
    Duplicate class member name 'bar' will be overwritten.
};
`,
		},
		{
			code: `
class Foo {
    bar() {}
    baz() {}
    bar() {}
}
`,
			snapshot: `
class Foo {
    bar() {}
    baz() {}
    bar() {}
    ~~~
    Duplicate class member name 'bar' will be overwritten.
}
`,
		},
		{
			code: `
class Foo {
    bar() {}
    bar() {}
    bar() {}
}
`,
			snapshot: `
class Foo {
    bar() {}
    bar() {}
    ~~~
    Duplicate class member name 'bar' will be overwritten.
    bar() {}
    ~~~
    Duplicate class member name 'bar' will be overwritten.
}
`,
		},
	],
	valid: [
		`class Foo {}`,
		`class Foo { bar() {} }`,
		`class Foo { bar() {} baz() {} }`,
		`class Foo { bar; baz; }`,
		`class Foo { bar() {} static bar() {} }`,
		`class Foo { get bar() { return 1; } set bar(value: number) {} }`,
		`class Foo { static get bar() { return 1; } static set bar(value: number) {} }`,
		`class Foo { [key]() {} [key]() {} }`,
		`class Foo { ["computed"]() {} ["computed"]() {} }`,
		`const Foo = class { bar() {} baz() {} };`,
	],
});
