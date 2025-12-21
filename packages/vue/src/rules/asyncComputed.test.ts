import path from "node:path";

import rule from "./asyncComputed.js";
import { ruleTester } from "./ruleTester.js";

// TODO: the default file.ts path is packages/vfs/file.ts, so imports from
// the vue package cannot be resolved, because vue is located in packages/vue/node_modules
const tsFileName = path.join(import.meta.dirname, "file.ts");

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
import { computed } from 'vue'

computed(async () => 'hello')
			`,
			fileName: tsFileName,
			snapshot: `
import { computed } from 'vue'

computed(async () => 'hello')
         ~~~~~~~~~~~~~~~~~~~
         Asynchronous functions in computed properties can lead to loss of reactivity.
			`,
		},
		{
			code: `
<script setup lang="ts">
	import { computed } from 'vue'

	computed(async () => 'hello')
</script>
			`,
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
			code: `
<script lang="ts">
	import { computed } from 'vue'
</script>

<script setup lang="ts">
	computed(async () => 'hello')
</script>
			`,
			snapshot: `
<script lang="ts">
	import { computed } from 'vue'
</script>

<script setup lang="ts">
	computed(async () => 'hello')
	         ~~~~~~~~~~~~~~~~~~~
	         Asynchronous functions in computed properties can lead to loss of reactivity.
</script>
			`,
		},
		{
			code: `
<script lang="ts">
	import { computed } from 'vue'

	computed(async () => 'hello')
</script>

<script setup lang="ts">
</script>
			`,
			snapshot: `
<script lang="ts">
	import { computed } from 'vue'

	computed(async () => 'hello')
	         ~~~~~~~~~~~~~~~~~~~
	         Asynchronous functions in computed properties can lead to loss of reactivity.
</script>

<script setup lang="ts">
</script>
			`,
		},
		{
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
		`
<script setup lang="ts">
	import { computed } from 'vue'

	computed()
</script>
		`,
		// invalid computed
		`
<script setup lang="ts">
	import { computed } from 'vue'

	computed('hello')
</script>
		`,
		`
<script setup lang="ts">
	import { computed } from 'vue'

	computed(() => 'hello')
</script>
		`,
		`
<script setup lang="ts">
	import { computed } from 'vue'

	computed(() => {
		return 'hello'
	})
</script>
		`,
		`
<script setup lang="ts">
	import { computed } from 'vue'

	computed(function comp() {
		return 'hello'
	})
</script>
		`,
		`
<script setup lang="ts">
	import { computed } from 'vue'

	declare function comp(): string

	computed(comp)
</script>
		`,
		`
<script setup lang="ts">
	import { computed } from 'vue'

	computed({
		get: () => 'hello',
		set: v => {}
	})
</script>
		`,
		`
<script setup lang="ts">
	import { computed } from 'vue'

	computed({
		get: () => 'hello',
		set: (v: number) => {}
	})
</script>
		`,
		`
<script setup lang="ts">
	import { computed } from 'vue'

	declare const getterAndSetter: {
		get: () => string
		set: (v: string) => void
	}

	computed(getterAndSetter)
</script>
		`,
		`
<script setup lang="ts">
	computed(async () => 'hello')
</script>
		`,
	],
});
