import rule from "./classMemberDuplicates.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
class Example {
    foo() {}
    foo() {}
}
`,
			snapshot: `
class Example {
    foo() {}
    foo() {}
    ~~~
    Duplicate class member name 'foo' will be overwritten.
}
`,
		},
		{
			code: `
class Example {
    bar = 1;
    bar = 2;
}
`,
			snapshot: `
class Example {
    bar = 1;
    bar = 2;
    ~~~
    Duplicate class member name 'bar' will be overwritten.
}
`,
		},
		{
			code: `
class Example {
    baz() {}
    baz = 3;
}
`,
			snapshot: `
class Example {
    baz() {}
    baz = 3;
    ~~~
    Duplicate class member name 'baz' will be overwritten.
}
`,
		},
		{
			code: `
class Example {
    static foo() {}
    static foo() {}
}
`,
			snapshot: `
class Example {
    static foo() {}
    static foo() {}
           ~~~
           Duplicate class member name 'foo' will be overwritten.
}
`,
		},
		{
			code: `
class Example {
    get value() { return 1; }
    get value() { return 2; }
}
`,
			snapshot: `
class Example {
    get value() { return 1; }
    get value() { return 2; }
        ~~~~~
        Duplicate class member name 'value' will be overwritten.
}
`,
		},
		{
			code: `
class Example {
    set value(v: number) {}
    set value(v: number) {}
}
`,
			snapshot: `
class Example {
    set value(v: number) {}
    set value(v: number) {}
        ~~~~~
        Duplicate class member name 'value' will be overwritten.
}
`,
		},
		{
			code: `
class Example {
    #private() {}
    #private() {}
}
`,
			snapshot: `
class Example {
    #private() {}
    #private() {}
    ~~~~~~~~
    Duplicate class member name '#private' will be overwritten.
}
`,
		},
		{
			code: `
class Example {
    "string-name"() {}
    "string-name"() {}
}
`,
			snapshot: `
class Example {
    "string-name"() {}
    "string-name"() {}
    ~~~~~~~~~~~~~
    Duplicate class member name 'string-name' will be overwritten.
}
`,
		},
		{
			code: `
class Example {
    123() {}
    123() {}
}
`,
			snapshot: `
class Example {
    123() {}
    123() {}
    ~~~
    Duplicate class member name '123' will be overwritten.
}
`,
		},
		{
			code: `
const MyClass = class {
    foo() {}
    foo() {}
};
`,
			snapshot: `
const MyClass = class {
    foo() {}
    foo() {}
    ~~~
    Duplicate class member name 'foo' will be overwritten.
};
`,
		},
		{
			code: `
class Example {
    foo() {}
    bar() {}
    foo() {}
}
`,
			snapshot: `
class Example {
    foo() {}
    bar() {}
    foo() {}
    ~~~
    Duplicate class member name 'foo' will be overwritten.
}
`,
		},
		{
			code: `
class Example {
    static bar = 1;
    static bar = 2;
}
`,
			snapshot: `
class Example {
    static bar = 1;
    static bar = 2;
           ~~~
           Duplicate class member name 'bar' will be overwritten.
}
`,
		},
	],
	valid: [
		`class Example { foo() {} bar() {} }`,
		`class Example { foo = 1; bar = 2; }`,
		`class Example { foo() {} static foo() {} }`,
		`class Example { get value() { return 1; } set value(v: number) {} }`,
		`class Example { #private = 1; public = 2; }`,
		`class Example { static foo() {} foo() {} }`,
		`class Example { [computed]() {} [computed]() {} }`,
		`class Example { ["a"]() {} ["b"]() {} }`,
		`const MyClass = class { foo() {} bar() {} };`,
		`
class Example {
    foo() {}
    bar() {}
    baz() {}
}
`,
		`
class Example {
    get value() { return this._value; }
    set value(v: number) { this._value = v; }
    private _value = 0;
}
`,
		`
class Example {
    static staticMethod() {}
    instanceMethod() {}
}
`,
	],
});
