import rule from "./consoleSpaces.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
console.log("test ");
`,
			snapshot: `
console.log("test ");
            ~~~~~~~
            This trailing space is unnecessary as Node.js console outputs already include spaces.
`,
		},
		{
			code: `
console.log(" test ");
`,
			snapshot: `
console.log(" test ");
            ~~~~~~~~
            This trailing space is unnecessary as Node.js console outputs already include spaces.
`,
		},
		{
			code: `
console.error(" error message  ");
`,
			snapshot: `
console.error(" error message  ");
              ~~~~~~~~~~~~~~~~~~
              This trailing space is unnecessary as Node.js console outputs already include spaces.
`,
		},
		{
			code: `
console.warn("warning ");
`,
			snapshot: `
console.warn("warning ");
             ~~~~~~~~~~
             This trailing space is unnecessary as Node.js console outputs already include spaces.
`,
		},
		{
			code: `
console.info(" info ");
`,
			snapshot: `
console.info(" info ");
             ~~~~~~~~
             This trailing space is unnecessary as Node.js console outputs already include spaces.
`,
		},
		{
			code: `
console.debug(" debug  ");
`,
			snapshot: `
console.debug(" debug  ");
              ~~~~~~~~~~
              This trailing space is unnecessary as Node.js console outputs already include spaces.
`,
		},
		{
			code: `
console.log("valid", " invalid");
`,
			snapshot: `
console.log("valid", " invalid");
                     ~~~~~~~~~~
                     This leading space is unnecessary as Node.js console outputs already include spaces.
`,
		},
		{
			code: `
console.trace(" trace ");
`,
			snapshot: `
console.trace(" trace ");
              ~~~~~~~~~
              This trailing space is unnecessary as Node.js console outputs already include spaces.
`,
		},
		{
			code: `
console.groupCollapsed(" collapsed ");
`,
			snapshot: `
console.groupCollapsed(" collapsed ");
                       ~~~~~~~~~~~~~
                       This trailing space is unnecessary as Node.js console outputs already include spaces.
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
		`console.log("  intentionally indented");`,
		`console.log("  intentionally indented", "more");`,
	],
});
