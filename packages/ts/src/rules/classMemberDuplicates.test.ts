import rule from "./classMemberDuplicates.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
class Example {
    value = 1;
    value = 2;
}
`,
			snapshot: `
class Example {
    value = 1;
    value = 2;
    ~~~~~~~~~~
    This class member has the same name as a previous member and will overwrite it.
}
`,
		},
		{
			code: `
class Example {
    getValue() { return 1; }
    getValue() { return 2; }
}
`,
			snapshot: `
class Example {
    getValue() { return 1; }
    getValue() { return 2; }
    ~~~~~~~~~~~~~~~~~~~~~~~~
    This class member has the same name as a previous member and will overwrite it.
}
`,
		},
		{
			code: `
class Example {
    "prop" = 1;
    "prop" = 2;
}
`,
			snapshot: `
class Example {
    "prop" = 1;
    "prop" = 2;
    ~~~~~~~~~~~
    This class member has the same name as a previous member and will overwrite it.
}
`,
		},
		{
			code: `
class Example {
    1 = "one";
    1 = "uno";
}
`,
			snapshot: `
class Example {
    1 = "one";
    1 = "uno";
    ~~~~~~~~~~
    This class member has the same name as a previous member and will overwrite it.
}
`,
		},
		{
			code: `
class Example {
    static count = 0;
    static count = 1;
}
`,
			snapshot: `
class Example {
    static count = 0;
    static count = 1;
    ~~~~~~~~~~~~~~~~~
    This class member has the same name as a previous member and will overwrite it.
}
`,
		},
		{
			code: `
class Example {
    #private = 1;
    #private = 2;
}
`,
			snapshot: `
class Example {
    #private = 1;
    #private = 2;
    ~~~~~~~~~~~~~
    This class member has the same name as a previous member and will overwrite it.
}
`,
		},
		{
			code: `
class Example {
    method() {}
    method = () => {};
}
`,
			snapshot: `
class Example {
    method() {}
    method = () => {};
    ~~~~~~~~~~~~~~~~~~
    This class member has the same name as a previous member and will overwrite it.
}
`,
		},
	],
	valid: [
		`class Example { value1 = 1; value2 = 2; }`,
		`class Example { getValue1() { return 1; } getValue2() { return 2; } }`,
		`class Example { static value = 1; value = 2; }`,
		`class Example { get value() { return 1; } set value(v: number) {} }`,
		`class Example { method(): void; method(arg: string): void; method(arg?: string) {} }`,
		`class Example { method(a: number): number; method(a: string): string; method(a: number | string) { return a as number; } }`,
	],
});
