import rule from "../../../ts/lib/rules/debuggerStatements.js";
import { vueLanguage } from "../index.js";
import { ruleTester } from "./ruleTester.js";

ruleTester.describe(vueLanguage.createRule(rule), {
	invalid: [
		{
			code: `
<script lang="ts" setup>
	debugger;
</script>
			`,
			fileName: "file.vue",
			snapshot: `
<script lang="ts" setup>
	debugger;
	~~~~~~~~~
	Debugger statements should not be used in production code.
</script>
			`,
			suggestions: [
				{
					id: "removeDebugger",
					updated: `
<script lang="ts" setup>
\t
</script>
			`,
				},
			],
		},
		{
			code: `
<template>
	<button @click="event => {
		debugger
		console.log(event)
	}">
		Hello
	</button>
</template>
			`,
			fileName: "file.vue",
			only: true,
			snapshot: `
<template>
	<button @click="event => {
		debugger
		~~~~~~~~
		Debugger statements should not be used in production code.
		console.log(event)
	}">
		Hello
	</button>
</template>
			`,
			suggestions: [
				{
					id: "removeDebugger",
					updated: `
<template>
	<button @click="event => {
\t\t
		console.log(event)
	}">
		Hello
	</button>
</template>
			`,
				},
			],
		},
	],
	valid: [
		{
			code: `
<script lang="ts" setup>
	hello
</script>
			`,
			fileName: "file.vue",
		},
	],
});
