import { ruleTester } from "./ruleTester.js";
import rule from "./unnecessaryCatches.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
try {
    doSomething();
} catch (error) {
    throw error;
}
`,
			snapshot: `
try {
    doSomething();
} catch (error) {
  ~~~~~
  Remove catch clauses that only rethrow the error without modification.
    throw error;
}
`,
		},
		{
			code: `
async function fetchData() {
    try {
        return await fetch("/api/data");
    } catch (error) {
        throw error;
    }
}
`,
			snapshot: `
async function fetchData() {
    try {
        return await fetch("/api/data");
    } catch (error) {
      ~~~~~
      Remove catch clauses that only rethrow the error without modification.
        throw error;
    }
}
`,
		},
		{
			code: `
try {
    processData();
} catch (exception) {
    throw exception;
}
`,
			snapshot: `
try {
    processData();
} catch (exception) {
  ~~~~~
  Remove catch clauses that only rethrow the error without modification.
    throw exception;
}
`,
		},
		{
			code: `
function handleRequest() {
    try {
        const result = performOperation();
        return result;
    } catch (err) {
        throw err;
    }
}
`,
			snapshot: `
function handleRequest() {
    try {
        const result = performOperation();
        return result;
    } catch (err) {
      ~~~~~
      Remove catch clauses that only rethrow the error without modification.
        throw err;
    }
}
`,
		},
	],
	valid: [
		`try { doSomething(); } catch (error) { console.error(error); throw error; }`,
		`try { doSomething(); } catch (error) { throw new Error("Failed"); }`,
		`try { doSomething(); } catch (error) { logError(error); throw error; }`,
		`try { doSomething(); } catch { throw new Error("Something went wrong"); }`,
		`
try {
    doSomething();
} catch (error) {
    console.error("An error occurred:", error);
    throw error;
}
`,
		`
try {
    doSomething();
} catch (error) {
    throw new Error("Operation failed: " + error.message);
}
`,
		`
try {
    doSomething();
} catch (error) {
    cleanup();
    throw error;
}
`,
		`
try {
    doSomething();
} catch (error) {
    throw error.originalError;
}
`,
		`
try {
    doSomething();
} catch (error) {
    // Comment explaining why we're rethrowing
    throw error;
}
`,
		`
async function fetchData() {
    try {
        return await fetch("/api/data");
    } catch (error) {
        await logError(error);
        throw error;
    }
}
`,
	],
});
