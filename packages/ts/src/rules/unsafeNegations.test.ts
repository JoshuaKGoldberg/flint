import { ruleTester } from "./ruleTester.js";
import rule from "./unsafeNegations.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
!key in object;
`,
			snapshot: `
!key in object;
~
This negation applies before the \`in\` operator.
`,
		},
		{
			code: `
!obj instanceof Constructor;
`,
			snapshot: `
!obj instanceof Constructor;
~
This negation applies before the \`instanceof\` operator.
`,
		},
		{
			code: `
(!key) in object;
`,
			snapshot: `
(!key) in object;
 ~
 This negation applies before the \`in\` operator.
`,
		},
		{
			code: `
(!obj) instanceof Constructor;
`,
			snapshot: `
(!obj) instanceof Constructor;
 ~
 This negation applies before the \`instanceof\` operator.
`,
		},
		{
			code: `
const exists = !key in object;
`,
			snapshot: `
const exists = !key in object;
               ~
               This negation applies before the \`in\` operator.
`,
		},
	],
	valid: [
		`!(key in object);`,
		`!(obj instanceof Constructor);`,
		`key in object;`,
		`obj instanceof Constructor;`,
		`!flag && key in object;`,
	],
});
