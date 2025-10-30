import path from "node:path";

import rule from "./asyncComputed.js";
import { ruleTester } from "./ruleTester.js";

const fileName = path.join(import.meta.dirname, "file.vue");

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed(async () => 'hello')
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed(async () => 'hello')
	         ~~~~~~~~~~~~~~~~~~~
	         Asynchronous functions in computed properties can lead to loss of reactivity.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed(async () => 'hello', {
		onTrack(e) {
			debugger
		}
	})
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed(async () => 'hello', {
	         ~~~~~~~~~~~~~~~~~~~
	         Asynchronous functions in computed properties can lead to loss of reactivity.
		onTrack(e) {
			debugger
		}
	})
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	async function foo() { return 'hello' }

	computed(foo)
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	import { computed } from 'vue'

	async function foo() { return 'hello' }

	computed(foo)
	         ~~~
	         Asynchronous functions in computed properties can lead to loss of reactivity.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed(() => {
		return fetch('https://example.com')
	})
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed(() => {
	         ~~~~~~~
	         Asynchronous functions in computed properties can lead to loss of reactivity.
		return fetch('https://example.com')
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	})
	~
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	class MyPromise<T> extends Promise<T> {}
	declare function fn(): MyPromise<string>

	computed(fn)
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	import { computed } from 'vue'

	class MyPromise<T> extends Promise<T> {}
	declare function fn(): MyPromise<string>

	computed(fn)
	         ~~
	         Asynchronous functions in computed properties can lead to loss of reactivity.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	declare function fn(): number | ({ foo: number } & Promise<string>)

	computed(fn)
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	import { computed } from 'vue'

	declare function fn(): number | ({ foo: number } & Promise<string>)

	computed(fn)
	         ~~
	         Asynchronous functions in computed properties can lead to loss of reactivity.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed({
		get: () => fetch('https://example.com'),
		set: v => {},
	})
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed({
	         ~
	         Asynchronous functions in computed properties can lead to loss of reactivity.
		get: () => fetch('https://example.com'),
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		set: v => {},
		~~~~~~~~~~~~~
	})
	~
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed({
		get: () => fetch('https://example.com'),
		set: v => {},
	}, {
		onTrack(e) {
			debugger
		}
	})
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed({
	         ~
	         Asynchronous functions in computed properties can lead to loss of reactivity.
		get: () => fetch('https://example.com'),
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		set: v => {},
		~~~~~~~~~~~~~
	}, {
	~
		onTrack(e) {
			debugger
		}
	})
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	declare const getterAndSetter: {
		get: () => Promise<string> | string
		set: (v: string) => void
	}

	computed(getterAndSetter)
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	import { computed } from 'vue'

	declare const getterAndSetter: {
		get: () => Promise<string> | string
		set: (v: string) => void
	}

	computed(getterAndSetter)
	         ~~~~~~~~~~~~~~~
	         Asynchronous functions in computed properties can lead to loss of reactivity.
</script>
			`,
		},
		{
			fileName,
			// TODO: volar sets different ScriptKind depending on <script> lang,
			// it doesn't work with current prepareFromVirtual
			code: `
<script>
	import { computed } from 'vue'
</script>

<script setup>
	computed(async () => 'hello')
</script>
			`,
			skip: true,
			snapshot: `
<script>
	import { computed } from 'vue'
</script>

<script setup>
	computed(async () => 'hello')
	         ~~~~~~~~~~~~~~~~~~~
	         Asynchronous functions in computed properties can lead to loss of reactivity.
</script>
			`,
		},
	],
	valid: [
		// invalid computed
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed()
</script>
			`,
			fileName,
		},
		// invalid computed
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed('hello')
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed(() => 'hello')
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed(() => {
		return 'hello'
	})
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed(function comp() {
		return 'hello'
	})
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	declare function comp(): string

	computed(comp)
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed({
		get: () => 'hello',
		set: v => {}
	})
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed({
		get: () => 'hello',
		set: (v: number) => {}
	})
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	declare const getterAndSetter: {
		get: () => string
		set: (v: string) => void
	}

	computed(getterAndSetter)
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	computed(async () => 'hello')
</script>
			`,
			fileName,
		},
	],
});
