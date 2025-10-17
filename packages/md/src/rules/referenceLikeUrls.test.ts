import rule from "./referenceLikeUrls.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
[**Mercury**](mercury) is the first planet from the sun.

[mercury]: https://example.com/mercury/
`,
			snapshot: `
[**Mercury**](mercury) is the first planet from the sun.
~~~~~~~~~~~~~~~~~~~~~~
This link uses a URL 'mercury' that matches a definition identifier.

[mercury]: https://example.com/mercury/
`,
		},
		{
			code: `
![**Mercury** is a planet](mercury).

[mercury]: https://example.com/mercury.jpg
`,
			snapshot: `
![**Mercury** is a planet](mercury).
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
This image uses a URL 'mercury' that matches a definition identifier.

[mercury]: https://example.com/mercury.jpg
`,
		},
		{
			code: `
[ESLint](eslint) is a great tool.

[eslint]: https://eslint.org
`,
			snapshot: `
[ESLint](eslint) is a great tool.
~~~~~~~~~~~~~~~~
This link uses a URL 'eslint' that matches a definition identifier.

[eslint]: https://eslint.org
`,
		},
		{
			code: `
Check out [this link](example).

[example]: https://example.com
`,
			snapshot: `
Check out [this link](example).
          ~~~~~~~~~~~~~~~~~~~~
          This link uses a URL 'example' that matches a definition identifier.

[example]: https://example.com
`,
		},
		{
			code: `
[Link one](alpha) and [link two](beta).

[alpha]: https://example.com/a
[beta]: https://example.com/b
`,
			snapshot: `
[Link one](alpha) and [link two](beta).
~~~~~~~~~~~~~~~~~
This link uses a URL 'alpha' that matches a definition identifier.
                      ~~~~~~~~~~~~~~~~
                      This link uses a URL 'beta' that matches a definition identifier.

[alpha]: https://example.com/a
[beta]: https://example.com/b
`,
		},
		{
			code: `
[Case Test](EXAMPLE)

[example]: https://example.com
`,
			snapshot: `
[Case Test](EXAMPLE)
~~~~~~~~~~~~~~~~~~~~
This link uses a URL 'EXAMPLE' that matches a definition identifier.

[example]: https://example.com
`,
		},
	],
	valid: [
		`
[**Mercury**][mercury] is the first planet from the sun.

[mercury]: https://example.com/mercury/
`,
		`
[ESLint](https://eslint.org) is a great tool.
`,
		`
![Mercury][mercury]

[mercury]: https://example.com/mercury.jpg
`,
		`
[Link with actual URL](https://example.com/page)
`,
		`
[Link without definition](some-page)
`,
		`
[Full URL as definition][https://example.com]

[https://example.com]: https://example.com
`,
		`
[Text](alpha)

No definition for alpha
`,
		`
[First][one] and [Second][two]

[one]: https://example.com/1
[two]: https://example.com/2
`,
	],
});
