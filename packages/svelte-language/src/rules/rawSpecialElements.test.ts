import rule from "./rawSpecialElements.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<head>
  <title>Title</title>
</head>
			`,
			snapshot: `
<head>
 ~~~~
 TODO: don't use \`head\` tag, use \`svelte:head\` instead
  <title>Title</title>
</head>
			`,
		},
	],
	valid: [
		`
<svelte:head>
  <title>Title</title>
</svelte:head>
		`,
	],
});
