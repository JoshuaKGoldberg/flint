import path from "node:path";
import rule from "../../../ts/lib/rules/anyReturns.js";
import { vueLanguage } from "../index.js";
import { ruleTester } from "./ruleTester.js";

const fileName = path.join(import.meta.dirname, "file.vue");

ruleTester.describe(vueLanguage.createRule(rule), {
	invalid: [
		{
			code: `
<script lang="ts" setup>
	function foo() {
		return 1 as any
	}
</script>
			`,
			fileName,
			snapshot: `
<script lang="ts" setup>
	function foo() {
		return 1 as any
		~~~~~~~~~~~~~~~
		Unsafe return of a value of type \`any\`.
	}
</script>
			`,
		},
		{
			code: `
<script lang="ts" setup>
	import MyComponent from './MyComponent.vue'

	const foo = 1 as any
</script>

<template>
	<MyComponent :foo="() => foo"/>
</template>
			`,
			fileName,
			snapshot: `
<script lang="ts" setup>
	import MyComponent from './MyComponent.vue'

	const foo = 1 as any
</script>

<template>
	<MyComponent :foo="() => foo"/>
	                         ~~~
	                         Unsafe return of a value of type \`any\`.
</template>
			`,
		},
		{
			code: `
<script lang="ts" setup>
	import MyComponent from './MyComponent.vue'

	const foo = 1
</script>

<template>
	<MyComponent :foo="() => [
		foo,
		foo,
	] as any"/>
</template>
			`,
			fileName,
			snapshot: `
<script lang="ts" setup>
	import MyComponent from './MyComponent.vue'

	const foo = 1
</script>

<template>
	<MyComponent :foo="() => [
	                         ~
	                         Unsafe return of a value of type \`any\`.
		foo,
		~~~~
		foo,
		~~~~
	] as any"/>
	~~~~~~~~
</template>
			`,
		},
	],
	valid: [
		{
			code: `
<script lang="ts" setup>
	import MyComponent from './MyComponent.vue'

	function foo() {
		return MyComponent
	}
</script>
			`,
			fileName,
		},
	],
});
