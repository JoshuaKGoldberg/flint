import rule from "./consoleSpaces.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
console.log(" test");
`,
			snapshot: `
console.log(" test");
            ~~~~~~~
            Avoid leading or trailing spaces in console method arguments.
`,
		},
		{
			code: `
console.log("test ");
`,
			snapshot: `
console.log("test ");
            ~~~~~~~
            Avoid leading or trailing spaces in console method arguments.
`,
		},
		{
			code: `
console.log(" test ");
`,
			snapshot: `
console.log(" test ");
            ~~~~~~~~
            Avoid leading or trailing spaces in console method arguments.
`,
		},
		{
			code: `
console.error(" error message");
`,
			snapshot: `
console.error(" error message");
              ~~~~~~~~~~~~~~~~
              Avoid leading or trailing spaces in console method arguments.
`,
		},
		{
			code: `
console.warn("warning ");
`,
			snapshot: `
console.warn("warning ");
             ~~~~~~~~~~
             Avoid leading or trailing spaces in console method arguments.
`,
		},
		{
			code: `
console.info(" info ");
`,
			snapshot: `
console.info(" info ");
             ~~~~~~~~
             Avoid leading or trailing spaces in console method arguments.
`,
		},
		{
			code: `
console.debug(" debug");
`,
			snapshot: `
console.debug(" debug");
              ~~~~~~~~
              Avoid leading or trailing spaces in console method arguments.
`,
		},
		{
			code: `
console.log("valid", " invalid");
`,
			snapshot: `
console.log("valid", " invalid");
                     ~~~~~~~~~~
                     Avoid leading or trailing spaces in console method arguments.
`,
		},
		{
			code: `
console.trace(" trace ");
`,
			snapshot: `
console.trace(" trace ");
              ~~~~~~~~~
              Avoid leading or trailing spaces in console method arguments.
`,
		},
		{
			code: `
console.group(" group");
`,
			snapshot: `
console.group(" group");
              ~~~~~~~~
              Avoid leading or trailing spaces in console method arguments.
`,
		},
		{
			code: `
console.groupCollapsed(" collapsed ");
`,
			snapshot: `
console.groupCollapsed(" collapsed ");
                       ~~~~~~~~~~~~~
                       Avoid leading or trailing spaces in console method arguments.
`,
		},
		{
			code: `
console.log(" ");
`,
			snapshot: `
console.log(" ");
            ~~~
            Avoid leading or trailing spaces in console method arguments.
`,
		},
	],
	valid: [
		`console.log("test");`,
		`console.log("test", "message");`,
		`console.error("error");`,
		`console.warn("warning");`,
		`console.info("info");`,
		`console.debug("debug");`,
		`console.log("test with spaces in middle");`,
		`console.log("test", "with", "multiple", "args");`,
		`console.log(variable);`,
		`console.log(123);`,
		`console.log(\`template\`);`,
		`console.trace("trace");`,
		`console.group("group");`,
		`console.groupCollapsed("collapsed");`,
		`console.table([1, 2, 3]);`,
		`console.time("timer");`,
		`console.timeEnd("timer");`,
		`console.assert(true, "assertion");`,
		`console.count("counter");`,
		`console.dir({});`,
		`console.log("");`,
	],
});
