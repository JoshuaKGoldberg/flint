import { ruleTester } from "./ruleTester.js";
import rule from "./unescapedEntities.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div>Greater than > sign</div>`,
			fileName: "file.tsx",
			snapshot: `
<div>Greater than > sign</div>
                  ~
                  This unescaped entity \`>\` may not render properly.`,
		},
		{
			code: `
<span>Double "quote" example</span>`,
			fileName: "file.tsx",
			snapshot: `
<span>Double "quote" example</span>
             ~
             This unescaped entity \`"\` may not render properly.
                   ~
                   This unescaped entity \`"\` may not render properly.`,
		},
		{
			code: `
<p>Single 'quote' example</p>`,
			fileName: "file.tsx",
			snapshot: `
<p>Single 'quote' example</p>
          ~
          This unescaped entity \`'\` may not render properly.
                ~
                This unescaped entity \`'\` may not render properly.`,
		},
		{
			code: `
<div>Closing } brace</div>`,
			fileName: "file.tsx",
			snapshot: `
<div>Closing } brace</div>
             ~
             This unescaped entity \`}\` may not render properly.`,
		},
		{
			code: `
<Component>Text with > and "</Component>`,
			fileName: "file.tsx",
			snapshot: `
<Component>Text with > and "</Component>
                     ~
                     This unescaped entity \`>\` may not render properly.
                           ~
                           This unescaped entity \`"\` may not render properly.`,
		},
		{
			code: `
<div>Multiple >> problems</div>`,
			fileName: "file.tsx",
			snapshot: `
<div>Multiple >> problems</div>
              ~
              This unescaped entity \`>\` may not render properly.
               ~
               This unescaped entity \`>\` may not render properly.`,
		},
	],
	valid: [
		{ code: `<div>Regular text</div>`, fileName: "file.tsx" },
		{ code: `<div>Text with &gt; entity</div>`, fileName: "file.tsx" },
		{ code: `<div>Text with &quot; entity</div>`, fileName: "file.tsx" },
		{ code: `<div>Text with &#39; entity</div>`, fileName: "file.tsx" },
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
