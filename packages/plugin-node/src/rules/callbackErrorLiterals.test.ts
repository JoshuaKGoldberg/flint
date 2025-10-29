import rule from "./callbackErrorLiterals.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
callback('error message');
`,
			snapshot: `
callback('error message');
         ~~~~~~~~~~~~~~~
         Prefer passing an Error instance or null/undefined as the first argument to error-first callbacks, not a literal value.
`,
		},
		{
			code: `
cb('error');
`,
			snapshot: `
cb('error');
   ~~~~~~~
   Prefer passing an Error instance or null/undefined as the first argument to error-first callbacks, not a literal value.
`,
		},
		{
			code: `
next('route');
`,
			snapshot: `
next('route');
     ~~~~~~~
     Prefer passing an Error instance or null/undefined as the first argument to error-first callbacks, not a literal value.
`,
		},
		{
			code: `
done(404);
`,
			snapshot: `
done(404);
     ~~~
     Prefer passing an Error instance or null/undefined as the first argument to error-first callbacks, not a literal value.
`,
		},
		{
			code: `
callback(true);
`,
			snapshot: `
callback(true);
         ~~~~
         Prefer passing an Error instance or null/undefined as the first argument to error-first callbacks, not a literal value.
`,
		},
		{
			code: `
callback(false);
`,
			snapshot: `
callback(false);
         ~~~~~
         Prefer passing an Error instance or null/undefined as the first argument to error-first callbacks, not a literal value.
`,
		},
		{
			code: `
callback({ message: 'error' });
`,
			snapshot: `
callback({ message: 'error' });
         ~~~~~~~~~~~~~~~~~~~~
         Prefer passing an Error instance or null/undefined as the first argument to error-first callbacks, not a literal value.
`,
		},
		{
			code: `
callback(['error']);
`,
			snapshot: `
callback(['error']);
         ~~~~~~~~~
         Prefer passing an Error instance or null/undefined as the first argument to error-first callbacks, not a literal value.
`,
		},
		{
			code: `
callback(\`error\`);
`,
			snapshot: `
callback(\`error\`);
         ~~~~~~~
         Prefer passing an Error instance or null/undefined as the first argument to error-first callbacks, not a literal value.
`,
		},
		{
			code: `
obj.callback('error');
`,
			snapshot: `
obj.callback('error');
             ~~~~~~~
             Prefer passing an Error instance or null/undefined as the first argument to error-first callbacks, not a literal value.
`,
		},
	],
	valid: [
		`callback(null);`,
		`callback(undefined);`,
		`callback(null, result);`,
		`callback(undefined, result);`,
		`callback(new Error('error message'));`,
		`callback(error);`,
		`callback(err);`,
		`callback();`,
		`cb(null, data);`,
		`next();`,
		`next(error);`,
		`done(null, result);`,
		`otherFunction('string');`,
		`someMethod(123);`,
		`obj.method('value');`,
		`obj.callback(null, data);`,
		`obj.callback(error);`,
	],
});
