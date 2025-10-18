import rule from "./imageContents.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
![]()
`,
			snapshot: `
![]()
~~~~~
This image has an empty URL.
`,
		},
		{
			code: `
![ESLint Logo]()
`,
			snapshot: `
![ESLint Logo]()
~~~~~~~~~~~~~~~~
This image has an empty URL.
`,
		},
		{
			code: `
![](#)
`,
			snapshot: `
![](#)
~~~~~~
This image has an empty URL.
`,
		},
		{
			code: `
![Image](#)
`,
			snapshot: `
![Image](#)
~~~~~~~~~~~
This image has an empty URL.
`,
		},
		{
			code: `
![Valid image](image.png)

![Empty image]()
`,
			snapshot: `
![Valid image](image.png)

![Empty image]()
~~~~~~~~~~~~~~~~
This image has an empty URL.
`,
		},
	],
	valid: [
		`![](https://eslint.org/image.png)`,
		`![ESLint Logo](https://eslint.org/image.png)`,
		`![Mountains](mountains.jpg)`,
		`![Logo](./logo.png)`,
		`
![Valid](image1.png)

![Also valid](image2.png)
`,
		`
Check out this ![inline image](photo.jpg) in the text.
`,
	],
});
