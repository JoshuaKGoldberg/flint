import rule from "./langValidity.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
const element = <div lang=""></div>;
`,
			fileName: "file.tsx",
			snapshot: `
const element = <div lang=""></div>;
                          ~~
                          The lang attribute value '(empty)' is not a valid BCP 47 language tag.
`,
		},
		{
			code: `
const element = <div lang="e"></div>;
`,
			fileName: "file.tsx",
			snapshot: `
const element = <div lang="e"></div>;
                          ~~~
                          The lang attribute value 'e' is not a valid BCP 47 language tag.
`,
		},
		{
			code: `
const element = <div lang="1234"></div>;
`,
			fileName: "file.tsx",
			snapshot: `
const element = <div lang="1234"></div>;
                          ~~~~~~
                          The lang attribute value '1234' is not a valid BCP 47 language tag.
`,
		},
		{
			code: `
const element = <div lang="en-"></div>;
`,
			fileName: "file.tsx",
			snapshot: `
const element = <div lang="en-"></div>;
                          ~~~~~
                          The lang attribute value 'en-' is not a valid BCP 47 language tag.
`,
		},
		{
			code: `
const element = <div lang="en-1"></div>;
`,
			fileName: "file.tsx",
			snapshot: `
const element = <div lang="en-1"></div>;
                          ~~~~~~
                          The lang attribute value 'en-1' is not a valid BCP 47 language tag.
`,
		},
		{
			code: `
const element = <html lang="123"></html>;
`,
			fileName: "file.tsx",
			snapshot: `
const element = <html lang="123"></html>;
                           ~~~~~
                           The lang attribute value '123' is not a valid BCP 47 language tag.
`,
		},
	],
	valid: [
		{ code: `const element = <div lang="en"></div>;`, fileName: "file.tsx" },
		{ code: `const element = <div lang="en-US"></div>;`, fileName: "file.tsx" },
		{ code: `const element = <div lang="en-GB"></div>;`, fileName: "file.tsx" },
		{
			code: `const element = <div lang="zh-Hans"></div>;`,
			fileName: "file.tsx",
		},
		{
			code: `const element = <div lang="zh-Hans-CN"></div>;`,
			fileName: "file.tsx",
		},
		{ code: `const element = <div lang="fr"></div>;`, fileName: "file.tsx" },
		{ code: `const element = <div lang="fr-CA"></div>;`, fileName: "file.tsx" },
		{
			code: `const element = <div lang="es-419"></div>;`,
			fileName: "file.tsx",
		},
		{ code: `const element = <html lang="en"></html>;`, fileName: "file.tsx" },
		{
			code: `const element = <html lang="en-US"></html>;`,
			fileName: "file.tsx",
		},
		{ code: `const element = <div></div>;`, fileName: "file.tsx" },
		{
			code: `const element = <div lang={language}></div>;`,
			fileName: "file.tsx",
		},
		{
			code: `const element = <div lang="en-GB-oxendict"></div>;`,
			fileName: "file.tsx",
		},
	],
});
