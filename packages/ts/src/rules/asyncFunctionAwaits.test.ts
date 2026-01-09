import rule from "./asyncFunctionAwaits.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
async function noAwait() {
    console.log("No await here");
}
`,
			snapshot: `
async function noAwait() {
~~~~~
Async functions should contain at least one await expression.
    console.log("No await here");
}
`,
		},
		{
			code: `
const asyncFn = async function () {
    return 42;
};
`,
			snapshot: `
const asyncFn = async function () {
                ~~~~~
                Async functions should contain at least one await expression.
    return 42;
};
`,
		},
		{
			code: `
const asyncArrow = async () => {
    return "value";
};
`,
			snapshot: `
const asyncArrow = async () => {
                   ~~~~~
                   Async functions should contain at least one await expression.
    return "value";
};
`,
		},
		{
			code: `
class MyClass {
    async method() {
        this.doSomething();
    }
}
`,
			snapshot: `
class MyClass {
    async method() {
    ~~~~~
    Async functions should contain at least one await expression.
        this.doSomething();
    }
}
`,
		},
		{
			code: `
async function nestedAwaitInFunction() {
    function inner() {
        await fetch("/api");
    }
}
`,
			snapshot: `
async function nestedAwaitInFunction() {
~~~~~
Async functions should contain at least one await expression.
    function inner() {
        await fetch("/api");
    }
}
`,
		},
		{
			code: `
async function nestedAwaitInArrow() {
    const inner = async () => {
        await fetch("/api");
    };
}
`,
			snapshot: `
async function nestedAwaitInArrow() {
~~~~~
Async functions should contain at least one await expression.
    const inner = async () => {
        await fetch("/api");
    };
}
`,
		},
		{
			code: `
const asyncArrowExpression = async () => 42;
`,
			snapshot: `
const asyncArrowExpression = async () => 42;
                             ~~~~~
                             Async functions should contain at least one await expression.
`,
		},
		{
			code: `
const obj = {
    async method() {
        return 42;
    }
};
`,
			snapshot: `
const obj = {
    async method() {
    ~~~~~
    Async functions should contain at least one await expression.
        return 42;
    }
};
`,
		},
		{
			code: `
async function* asyncGenNoAwait() {
    yield 1;
    yield 2;
}
`,
			snapshot: `
async function* asyncGenNoAwait() {
~~~~~
Async functions should contain at least one await expression.
    yield 1;
    yield 2;
}
`,
		},
		{
			code: `
const asyncGenExpr = async function* () {
    yield 1;
};
`,
			snapshot: `
const asyncGenExpr = async function* () {
                     ~~~~~
                     Async functions should contain at least one await expression.
    yield 1;
};
`,
		},
		// Async generator method without await
		{
			code: `
class MyClass {
    async *genMethod() {
        yield 1;
    }
}
`,
			snapshot: `
class MyClass {
    async *genMethod() {
    ~~~~~
    Async functions should contain at least one await expression.
        yield 1;
    }
}
`,
		},
	],
	valid: [
		`
async function validAsync() {
    await fetch("/api");
}
`,
		`
async function multipleAwaits() {
    const a = await fetch("/api");
    const b = await a.json();
    return b;
}
`,
		`
const asyncFn = async function () {
    await Promise.resolve(42);
};
`,
		`
const asyncArrow = async () => {
    await Promise.resolve("value");
};
`,
		`
class MyClass {
    async method() {
        await this.asyncOperation();
    }
}
`,
		`
async function conditionalAwait(condition: boolean) {
    if (condition) {
        await fetch("/api");
    }
}
`,
		`
async function awaitInLoop() {
    for (let i = 0; i < 10; i++) {
        await fetch("/api");
    }
}
`,
		`
async function forAwaitOf() {
    for await (const value of asyncIterable) {
        console.log(value);
    }
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
async function nestedWithAwait() {
    await fetch("/api");
    function inner() {
        return 42;
    }
}
`,
		`const asyncArrowExpression = async () => await fetch("/api");`,
		`
const obj = {
    async method() {
        await fetch("/api");
    }
};
`,
		`
async function awaitInTryCatch() {
    try {
        await fetch("/api");
    } catch {
        console.log("error");
    }
}
`,
		// Empty async functions should be exempt
		`async function emptyAsync() {}`,
		`const emptyAsyncArrow = async () => {};`,
		`
class MyClass {
    async emptyMethod() {}
}
`,
		// await using declarations count as await usage
		`
async function awaitUsing() {
    await using resource = getResource();
}
`,
		`
async function awaitUsingMultiple() {
    await using a = getResourceA();
    await using b = getResourceB();
}
`,
		// Async generators with await
		`
async function* asyncGenWithAwait() {
    yield await Promise.resolve(1);
}
`,
		// Async generators with for await...of
		`
async function* asyncGenForAwait() {
    for await (const value of asyncIterable) {
        yield value;
    }
}
`,
		// Functions returning thenable types are valid (type-checked)
		`
async function returnsPromise(): Promise<number> {
    return Promise.resolve(42);
}
`,
		`
async function returnsFetch() {
    return fetch("/api");
}
`,
		`const asyncArrowReturnsPromise = async () => Promise.resolve(42);`,
		`
class MyClass {
    async method() {
        return Promise.resolve("value");
    }
}
`,
		`
async function conditionalPromiseReturn(condition: boolean) {
    if (condition) {
        return Promise.resolve(1);
    }
    return Promise.resolve(2);
}
`,
	],
});
