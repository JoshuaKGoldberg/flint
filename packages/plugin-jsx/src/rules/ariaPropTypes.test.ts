import rule from "./ariaPropTypes.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<div aria-hidden="yes" />
`,
			fileName: "file.tsx",
			snapshot: `
<div aria-hidden="yes" />
                 ~~~~~
                 \`aria-hidden\` should have a value of true, false, or mixed, but received \`yes\`.
`,
		},
		{
			code: `
<input aria-checked="1" />
`,
			fileName: "file.tsx",
			snapshot: `
<input aria-checked="1" />
                    ~~~
                    \`aria-checked\` should have a value of true, false, or mixed, but received \`1\`.
`,
		},
		{
			code: `
<div aria-level="low" />
`,
			fileName: "file.tsx",
			snapshot: `
<div aria-level="low" />
                ~~~~~
                \`aria-level\` should have a value of an integer, but received \`low\`.
`,
		},
		{
			code: `
<div aria-valuemax="high" />
`,
			fileName: "file.tsx",
			snapshot: `
<div aria-valuemax="high" />
                   ~~~~~~
                   \`aria-valuemax\` should have a value of a number, but received \`high\`.
`,
		},
		{
			code: `
<button aria-pressed="yes" />
`,
			fileName: "file.tsx",
			snapshot: `
<button aria-pressed="yes" />
                     ~~~~~
                     \`aria-pressed\` should have a value of true, false, or mixed, but received \`yes\`.
`,
		},
		{
			code: `
<div aria-autocomplete="invalid" />
`,
			fileName: "file.tsx",
			snapshot: `
<div aria-autocomplete="invalid" />
                       ~~~~~~~~~
                       \`aria-autocomplete\` should have a value of one of: both, inline, list, none, but received \`invalid\`.
`,
		},
		{
			code: `
<div aria-live="loud" />
`,
			fileName: "file.tsx",
			snapshot: `
<div aria-live="loud" />
               ~~~~~~
               \`aria-live\` should have a value of one of: assertive, off, polite, but received \`loud\`.
`,
		},
		{
			code: `
<div aria-orientation="diagonal" />
`,
			fileName: "file.tsx",
			snapshot: `
<div aria-orientation="diagonal" />
                      ~~~~~~~~~~
                      \`aria-orientation\` should have a value of one of: horizontal, undefined, vertical, but received \`diagonal\`.
`,
		},
		{
			code: `
<div aria-level="2.5" />
`,
			fileName: "file.tsx",
			snapshot: `
<div aria-level="2.5" />
                ~~~~~
                \`aria-level\` should have a value of an integer, but received \`2.5\`.
`,
		},
		{
			code: `
<div aria-disabled="disabled" />
`,
			fileName: "file.tsx",
			snapshot: `
<div aria-disabled="disabled" />
                   ~~~~~~~~~~
                   \`aria-disabled\` should have a value of true or false, but received \`disabled\`.
`,
		},
	],
	valid: [
		{ code: `<div aria-hidden="true" />`, fileName: "file.tsx" },
		{ code: `<div aria-hidden="false" />`, fileName: "file.tsx" },
		{ code: `<div aria-hidden={true} />`, fileName: "file.tsx" },
		{ code: `<div aria-hidden={false} />`, fileName: "file.tsx" },
		{ code: `<input aria-checked="true" />`, fileName: "file.tsx" },
		{ code: `<input aria-checked="false" />`, fileName: "file.tsx" },
		{ code: `<input aria-checked="mixed" />`, fileName: "file.tsx" },
		{ code: `<input aria-checked={true} />`, fileName: "file.tsx" },
		{ code: `<input aria-checked={false} />`, fileName: "file.tsx" },
		{ code: `<div aria-level="1" />`, fileName: "file.tsx" },
		{ code: `<div aria-level="2" />`, fileName: "file.tsx" },
		{ code: `<div aria-level={3} />`, fileName: "file.tsx" },
		{ code: `<div aria-valuemax="100" />`, fileName: "file.tsx" },
		{ code: `<div aria-valuemax="100.5" />`, fileName: "file.tsx" },
		{ code: `<div aria-valuemax={100} />`, fileName: "file.tsx" },
		{ code: `<div aria-valuemax={100.5} />`, fileName: "file.tsx" },
		{ code: `<div aria-label="Submit form" />`, fileName: "file.tsx" },
		{ code: `<div aria-placeholder="Enter text" />`, fileName: "file.tsx" },
		{ code: `<button aria-pressed="true" />`, fileName: "file.tsx" },
		{ code: `<button aria-pressed="false" />`, fileName: "file.tsx" },
		{ code: `<button aria-pressed="mixed" />`, fileName: "file.tsx" },
		{ code: `<div aria-autocomplete="inline" />`, fileName: "file.tsx" },
		{ code: `<div aria-autocomplete="list" />`, fileName: "file.tsx" },
		{ code: `<div aria-autocomplete="both" />`, fileName: "file.tsx" },
		{ code: `<div aria-autocomplete="none" />`, fileName: "file.tsx" },
		{ code: `<div aria-live="polite" />`, fileName: "file.tsx" },
		{ code: `<div aria-live="assertive" />`, fileName: "file.tsx" },
		{ code: `<div aria-live="off" />`, fileName: "file.tsx" },
		{ code: `<div aria-orientation="horizontal" />`, fileName: "file.tsx" },
		{ code: `<div aria-orientation="vertical" />`, fileName: "file.tsx" },
		{ code: `<div aria-orientation="undefined" />`, fileName: "file.tsx" },
		{ code: `<div aria-controls="id1 id2" />`, fileName: "file.tsx" },
		{ code: `<div aria-describedby="desc1" />`, fileName: "file.tsx" },
		{ code: `<div aria-labelledby="label1 label2" />`, fileName: "file.tsx" },
		{ code: `<div aria-activedescendant="item1" />`, fileName: "file.tsx" },
		{ code: `<div aria-current="page" />`, fileName: "file.tsx" },
		{ code: `<div aria-current="step" />`, fileName: "file.tsx" },
		{ code: `<div aria-current="true" />`, fileName: "file.tsx" },
		{ code: `<div aria-current="false" />`, fileName: "file.tsx" },
		{ code: `<div aria-invalid="true" />`, fileName: "file.tsx" },
		{ code: `<div aria-invalid="false" />`, fileName: "file.tsx" },
		{ code: `<div aria-invalid="grammar" />`, fileName: "file.tsx" },
		{ code: `<div aria-invalid="spelling" />`, fileName: "file.tsx" },
		{ code: `<div aria-haspopup="true" />`, fileName: "file.tsx" },
		{ code: `<div aria-haspopup="false" />`, fileName: "file.tsx" },
		{ code: `<div aria-haspopup="menu" />`, fileName: "file.tsx" },
		{ code: `<div aria-haspopup="listbox" />`, fileName: "file.tsx" },
		{ code: `<div aria-sort="ascending" />`, fileName: "file.tsx" },
		{ code: `<div aria-sort="descending" />`, fileName: "file.tsx" },
		{ code: `<div aria-sort="none" />`, fileName: "file.tsx" },
		{ code: `<div aria-sort="other" />`, fileName: "file.tsx" },
		{ code: `<div />`, fileName: "file.tsx" },
		{ code: `<input />`, fileName: "file.tsx" },
		{ code: `<div aria-expanded={isExpanded} />`, fileName: "file.tsx" },
		{ code: `<div aria-label={labelText} />`, fileName: "file.tsx" },
	],
});
