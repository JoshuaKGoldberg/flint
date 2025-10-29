import rule from "./unescapedEntities.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div>Greater than > sign</div>`,
			fileName: "file.tsx",
			snapshot: `
<div>Greater than > sign</div>
     ~~~~~~~~~~~~~~~~~~~
     Unescaped entity \`>\` found in JSX text. Use HTML entity (&gt;) or wrap in braces ({'>'}).`,
		},
		{
			code: `
<span>Double "quote" example</span>`,
			fileName: "file.tsx",
			snapshot: `
<span>Double "quote" example</span>
      ~~~~~~~~~~~~~~~~~~~~~~
      Unescaped entity \`"\` found in JSX text. Use HTML entity (&quot;) or wrap in braces ({"\\""}).`,
		},
		{
			code: `
<p>Single 'quote' example</p>`,
			fileName: "file.tsx",
			snapshot: `
<p>Single 'quote' example</p>
   ~~~~~~~~~~~~~~~~~~~~~~
   Unescaped entity \`'\` found in JSX text. Use HTML entity (&apos;) or wrap in braces ({"'"}).`,
		},
		{
			code: `
<div>Closing } brace</div>`,
			fileName: "file.tsx",
			snapshot: `
<div>Closing } brace</div>
     ~~~~~~~~~~~~~~~
     Unescaped entity \`}\` found in JSX text. Use HTML entity (&#125;) or wrap in braces ({'}'}).`,
		},
		{
			code: `
<Component>Text with > and "</Component>`,
			fileName: "file.tsx",
			snapshot: `
<Component>Text with > and "</Component>
           ~~~~~~~~~~~~~~~~~
           Unescaped entity \`>\` found in JSX text. Use HTML entity (&gt;) or wrap in braces ({'>'}).`,
		},
	],
	valid: [
		{ code: `<div>Regular text</div>`, fileName: "file.tsx" },
		{ code: `<div>Text with &gt; entity</div>`, fileName: "file.tsx" },
		{ code: `<div>Text with &quot; entity</div>`, fileName: "file.tsx" },
		{ code: `<div>Text with &apos; entity</div>`, fileName: "file.tsx" },
		{ code: `<div>Text with &#125; entity</div>`, fileName: "file.tsx" },
		{ code: `<div>{'>'}{'<'}</div>`, fileName: "file.tsx" },
		{ code: `<div>{'"'}</div>`, fileName: "file.tsx" },
		{ code: `<div>{"'"}</div>`, fileName: "file.tsx" },
		{ code: `<div>{'}'}</div>`, fileName: "file.tsx" },
		{ code: `<div>No special characters here</div>`, fileName: "file.tsx" },
		{
			code: `<div>
    Regular text content
</div>`,
			fileName: "file.tsx",
		},
		{
			code: `<a href="https://example.com">Link</a>`,
			fileName: "file.tsx",
		},
	],
});
