import rule from "./bareUrls.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
For more info, visit https://www.example.com
`,
			snapshot: `
For more info, visit https://www.example.com
                     ~~~~~~~~~~~~~~~~~~~~~~~
                     This bare URL should be wrapped in angle brackets or formatted as a link.
`,
		},
		{
			code: `
For more info, visit https://www.example.com/
`,
			snapshot: `
For more info, visit https://www.example.com/
                     ~~~~~~~~~~~~~~~~~~~~~~~~
                     This bare URL should be wrapped in angle brackets or formatted as a link.
`,
		},
		{
			code: `
Visit https://example.com for details.
`,
			snapshot: `
Visit https://example.com for details.
      ~~~~~~~~~~~~~~~~~~~
      This bare URL should be wrapped in angle brackets or formatted as a link.
`,
		},
		{
			code: `
Multiple links: https://first.com and https://second.com
`,
			snapshot: `
Multiple links: https://first.com and https://second.com
                ~~~~~~~~~~~~~~~~~
                This bare URL should be wrapped in angle brackets or formatted as a link.
                                      ~~~~~~~~~~~~~~~~~~
                                      This bare URL should be wrapped in angle brackets or formatted as a link.
`,
		},
		{
			code: `
# https://www.example.com/
`,
			snapshot: `
# https://www.example.com/
  ~~~~~~~~~~~~~~~~~~~~~~~~
  This bare URL should be wrapped in angle brackets or formatted as a link.
`,
		},
	],
	valid: [
		`For more info, visit <https://www.example.com/>`,
		`For more info, visit [Example Website](https://www.example.com)`,
		`Contact us at <user@example.com>`,
		`Contact us at [user@example.com](mailto:user@example.com)`,
		`# <https://www.example.com/>`,
		`Not a clickable link: \`https://www.example.com/\``,
		`
\`\`\`
https://www.example.com/
\`\`\`
`,
		`[Read the docs](https://www.example.com)`,
		`
[docs]: https://www.example.com/docs
`,
	],
});
