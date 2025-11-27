import path from "node:path";

import rule from "../../../ts/lib/rules/debuggerStatements.js";
import { vueLanguage } from "../language.js";
import { ruleTester } from "./ruleTester.js";

const fileName = path.join(import.meta.dirname, "file.vue");

ruleTester.describe(vueLanguage.createRule(rule), {
	invalid: [
		{
			code: `
<script lang="ts" setup>
	debugger;
</script>
			`,
			fileName,
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
			fileName,
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
			fileName,
		},
	],
});
