import rule from "./awaitInsidePromiseMethods.ts";
import { ruleTester } from "./ruleTester.ts";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
Promise.all([await promise, anotherPromise]);
`,
			snapshot: `
Promise.all([await promise, anotherPromise]);
             ~~~~~
             Awaiting promises inside Promise.all() is redundant because it accepts promises directly.
`,
		},
		{
			code: `
Promise.allSettled([await promise, anotherPromise]);
`,
			snapshot: `
Promise.allSettled([await promise, anotherPromise]);
                    ~~~~~
                    Awaiting promises inside Promise.allSettled() is redundant because it accepts promises directly.
`,
		},
		{
			code: `
Promise.any([await promise, anotherPromise]);
`,
			snapshot: `
Promise.any([await promise, anotherPromise]);
             ~~~~~
             Awaiting promises inside Promise.any() is redundant because it accepts promises directly.
`,
		},
		{
			code: `
Promise.race([await promise, anotherPromise]);
`,
			snapshot: `
Promise.race([await promise, anotherPromise]);
              ~~~~~
              Awaiting promises inside Promise.race() is redundant because it accepts promises directly.
`,
		},
		{
			code: `
Promise.all([await first, await second, await third]);
`,
			snapshot: `
Promise.all([await first, await second, await third]);
             ~~~~~
             Awaiting promises inside Promise.all() is redundant because it accepts promises directly.
                          ~~~~~
                          Awaiting promises inside Promise.all() is redundant because it accepts promises directly.
                                        ~~~~~
                                        Awaiting promises inside Promise.all() is redundant because it accepts promises directly.
`,
		},
		{
			code: `
async function fetchData() {
    return Promise.all([await fetch("/a"), await fetch("/b")]);
}
`,
			snapshot: `
async function fetchData() {
    return Promise.all([await fetch("/a"), await fetch("/b")]);
                        ~~~~~
                        Awaiting promises inside Promise.all() is redundant because it accepts promises directly.
                                           ~~~~~
                                           Awaiting promises inside Promise.all() is redundant because it accepts promises directly.
}
`,
		},
	],
	valid: [
		"Promise.all([promise, anotherPromise]);",
		"Promise.allSettled([promise, anotherPromise]);",
		"Promise.any([promise, anotherPromise]);",
		"Promise.race([promise, anotherPromise]);",
		"Promise.all([fetch('/a'), fetch('/b')]);",
		"Promise.resolve(await promise);",
		"Promise.reject(await error);",
		"SomeOtherClass.all([await promise]);",
		"Promise.all(promises);",
		"Promise.all([...promises]);",
	],
});
