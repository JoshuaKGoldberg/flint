import rule from "../../../ts/lib/rules/anyReturns.js";
import { svelteLanguage } from "../language.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(svelteLanguage.createRule(rule), {
	invalid: [
		{
			code: `
<script lang="ts">
	function foo() {
		return {} as any
	}
</script>
			`,
			snapshot: `
<script lang="ts">
	function foo() {
		return {} as any
		~~~~~~~~~~~~~~~~
		Unsafe return of a value of type \`any\`.
	}
</script>
			`,
		},
		{
			code: `
<script lang="ts">
	let foo = {} as any
</script>

<button onclick={() => foo}></button>
			`,
			snapshot: `
<script lang="ts">
	let foo = {} as any
</script>

<button onclick={() => foo}></button>
                       ~~~
                       Unsafe return of a value of type \`any\`.
			`,
		},
	],
	valid: [
		{
			code: `
<script lang="ts">
	let foo = {}
</script>

<button onclick={() => foo}></button>
		`,
		},
	],
});
