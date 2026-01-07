import rule from "./asyncUnnecessaryPromiseWrappers.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
async function getData() {
    return Promise.resolve(42);
}
`,
			snapshot: `
async function getData() {
    return Promise.resolve(42);
           ~~~~~~~~~~~~~~~
           Prefer returning the value directly instead of wrapping it with Promise.resolve().
}
`,
		},
		{
			code: `
async function handleError() {
    return Promise.reject(new Error("failed"));
}
`,
			snapshot: `
async function handleError() {
    return Promise.reject(new Error("failed"));
           ~~~~~~~~~~~~~~
           Prefer throwing the error directly instead of wrapping it with Promise.reject().
}
`,
		},
		{
			code: `
const asyncFn = async () => {
    return Promise.resolve("value");
};
`,
			snapshot: `
const asyncFn = async () => {
    return Promise.resolve("value");
           ~~~~~~~~~~~~~~~
           Prefer returning the value directly instead of wrapping it with Promise.resolve().
};
`,
		},
		{
			code: `
const asyncArrow = async () => Promise.resolve(42);
`,
			snapshot: `
const asyncArrow = async () => Promise.resolve(42);
                               ~~~~~~~~~~~~~~~
                               Prefer returning the value directly instead of wrapping it with Promise.resolve().
`,
		},
		{
			code: `
const promise: Promise<number> = Promise.resolve(1);
promise.then(() => {
    return Promise.resolve(42);
});
`,
			snapshot: `
const promise: Promise<number> = Promise.resolve(1);
promise.then(() => {
    return Promise.resolve(42);
           ~~~~~~~~~~~~~~~
           Prefer returning the value directly instead of wrapping it with Promise.resolve().
});
`,
		},
		{
			code: `
const promise: Promise<number> = Promise.resolve(1);
promise.catch(() => {
    return Promise.reject(new Error("failed"));
});
`,
			snapshot: `
const promise: Promise<number> = Promise.resolve(1);
promise.catch(() => {
    return Promise.reject(new Error("failed"));
           ~~~~~~~~~~~~~~
           Prefer throwing the error directly instead of wrapping it with Promise.reject().
});
`,
		},
		{
			code: `
async function* generator() {
    yield Promise.resolve(42);
}
`,
			snapshot: `
async function* generator() {
    yield Promise.resolve(42);
          ~~~~~~~~~~~~~~~
          Prefer returning the value directly instead of wrapping it with Promise.resolve().
}
`,
		},
	],
	valid: [
		`
async function getData() {
    return 42;
}
`,
		`
async function getData() {
    return await fetch("/api");
}
`,
		`
function regularFn() {
    return Promise.resolve(42);
}
`,
		`
const arrow = () => Promise.resolve(42);
`,
		`
function createPromise() {
    return Promise.resolve(42);
}
`,
		`
async function storePromise() {
    const p = Promise.resolve(42);
    return p;
}
`,
		`
promise.then((value) => value * 2);
`,
		`
const promise: Promise<number> = Promise.resolve(1);
promise.then((value) => value * 2);
`,
	],
});
