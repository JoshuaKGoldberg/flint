import rule from "./asyncFunctionAwaits.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
async function doSomething() {
    console.log("no await");
}
`,
			snapshot: `
async function doSomething() {
~~~~~
Async functions should contain an await expression or return a Promise.
    console.log("no await");
}
`,
		},
		{
			code: `
const fn = async () => {
    return 42;
};
`,
			snapshot: `
const fn = async () => {
           ~~~~~
           Async functions should contain an await expression or return a Promise.
    return 42;
};
`,
		},
		{
			code: `
const fn = async function() {
    return "hello";
};
`,
			snapshot: `
const fn = async function() {
           ~~~~~
           Async functions should contain an await expression or return a Promise.
    return "hello";
};
`,
		},
		{
			code: `
class Example {
    async method() {
        this.doSomething();
    }
}
`,
			snapshot: `
class Example {
    async method() {
    ~~~~~
    Async functions should contain an await expression or return a Promise.
        this.doSomething();
    }
}
`,
		},
		{
			code: `
async function nestedAwait() {
    const inner = async () => {
        await Promise.resolve();
    };
}
`,
			snapshot: `
async function nestedAwait() {
~~~~~
Async functions should contain an await expression or return a Promise.
    const inner = async () => {
        await Promise.resolve();
    };
}
`,
		},
		{
			code: `
const fn = async () => 42;
`,
			snapshot: `
const fn = async () => 42;
           ~~~~~
           Async functions should contain an await expression or return a Promise.
`,
		},
		{
			code: `
async function returnsNonThenable() {
    return { value: 42 };
}
`,
			snapshot: `
async function returnsNonThenable() {
~~~~~
Async functions should contain an await expression or return a Promise.
    return { value: 42 };
}
`,
		},
	],
	valid: [
		`
async function withAwait() {
    await Promise.resolve();
}
`,
		`
async function withForAwaitOf() {
    for await (const item of asyncIterable) {
        console.log(item);
    }
}
`,
		`
const fn = async () => {
    await fetch("/api");
};
`,
		`
class Example {
    async method() {
        await this.fetchData();
    }
}
`,
		`
async function* generator() {
    yield 1;
}
`,
		`
function regularFunction() {
    return 42;
}
`,
		`
const arrow = () => {
    return 42;
};
`,
		`
async function returnsPromise(): Promise<number> {
    return Promise.resolve(42);
}
`,
		`
async function callsAsyncFunction() {
    return fetch("/api");
}
`,
		`
async function emptyFunction() {}
`,
		`
const fn = async () => fetch("/api");
`,
		`
async function conditionalReturn(condition: boolean) {
    if (condition) {
        return Promise.resolve(42);
    }
    return 0;
}
`,
		`
async function awaitInConditional(condition: boolean) {
    if (condition) {
        await Promise.resolve();
    }
}
`,
		`
declare function asyncOperation(): Promise<void>;
async function withAbstract() {
    return asyncOperation();
}
`,
	],
});
