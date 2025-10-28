import rule from "./roleTags.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div role="button" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="button" />
     ~~~~~~~~~~~~~
     <div> with role='button' is a less-accessible equivalent of <button>.
`,
		},
		{
			code: `
<div role="img" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="img" />
     ~~~~~~~~~~
     <div> with role='img' is a less-accessible equivalent of <img>.
`,
		},
		{
			code: `
<span role="link" />
`,
			fileName: "file.tsx",
			snapshot: `
<span role="link" />
      ~~~~~~~~~~~
      <span> with role='link' is a less-accessible equivalent of <a>.
`,
		},
		{
			code: `
<div role="navigation" />
`,
			fileName: "file.tsx",
			snapshot: `
<div role="navigation" />
     ~~~~~~~~~~~~~~~~~
     <div> with role='navigation' is a less-accessible equivalent of <nav>.
`,
		},
	],
	valid: [
		{ code: `<button />`, fileName: "file.tsx" },
		{ code: `<img />`, fileName: "file.tsx" },
		{ code: `<a href="#" />`, fileName: "file.tsx" },
		{ code: `<nav />`, fileName: "file.tsx" },
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<div role="presentation" />`, fileName: "file.tsx" },
	],
});
