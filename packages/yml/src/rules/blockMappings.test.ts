import rule from "./blockMappings.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
key: {nested: value}
`,
			snapshot: `
key: {nested: value}
     ~~~~~~~~~~~~~~~
     Prefer block-style mappings over flow-style mappings for improved readability.
`,
		},
		{
			code: `
outer: {inner: value, another: data}
`,
			snapshot: `
outer: {inner: value, another: data}
       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       Prefer block-style mappings over flow-style mappings for improved readability.
`,
		},
		{
			code: `
parent:
    child: {nested: value}
`,
			snapshot: `
parent:
    child: {nested: value}
           ~~~~~~~~~~~~~~~
           Prefer block-style mappings over flow-style mappings for improved readability.
`,
		},
		{
			code: `
items:
    - {name: first}
    - {name: second}
`,
			snapshot: `
items:
    - {name: first}
      ~~~~~~~~~~~~~
      Prefer block-style mappings over flow-style mappings for improved readability.
    - {name: second}
      ~~~~~~~~~~~~~~
      Prefer block-style mappings over flow-style mappings for improved readability.
`,
		},
	],
	valid: [
		`key: value`,
		`
key:
    nested: value
`,
		`
outer:
    inner: value
    another: data
`,
		`
parent:
    child:
        nested: value
`,
		`
items:
    - name: first
    - name: second
`,
	],
});
