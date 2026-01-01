import rule from "./setHtmlDirectives.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
---
let string = 'this string contains some <strong>HTML!!!</strong>'
---

<p set:html={string}></p>
			`,
			snapshot: `
---
let string = 'this string contains some <strong>HTML!!!</strong>'
---

<p set:html={string}></p>
   ~~~~~~~~
   TODO: don't use set:html to reduce XSS risk
			`,
		},
		{
			code: `
<div>
	<p set:html=\`this string contains some <strong>HTML!!!</strong>\`></p>
</div>
			`,
			snapshot: `
<div>
	<p set:html=\`this string contains some <strong>HTML!!!</strong>\`></p>
	   ~~~~~~~~
	   TODO: don't use set:html to reduce XSS risk
</div>
			`,
		},
	],
	valid: [
		`
---
let string = 'this string contains some <strong>HTML!!!</strong>'
---

<p set:text={string}></p>
		`,
		"<p set:text=`this string contains some <strong>HTML!!!</strong>`></p>",
		`
---
let string = 'this string contains some <strong>HTML!!!</strong>'
---

<p>{string}</p>
		`,
		"<p>{`this string contains some <strong>HTML!!!</strong>`}</p>",
	],
});
