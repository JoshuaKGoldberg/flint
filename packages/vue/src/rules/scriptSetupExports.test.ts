import path from "node:path";

import { ruleTester } from "./ruleTester.js";
import rule from "./scriptSetupExports.js";

const fileName = path.join(import.meta.dirname, "file.vue");

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<script setup lang="ts">
	export const foo = 1
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	export const foo = 1
	~~~~~~
	\`<script setup>\` cannot contain ES module exports.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	type foo = 1

	export { foo }
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	type foo = 1

	export { foo }
	~~~~~~
	\`<script setup>\` cannot contain ES module exports.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	type foo = 1

	export { foo }
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	type foo = 1

	export { foo }
	~~~~~~
	\`<script setup>\` cannot contain ES module exports.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	type foo = 1
	type bar = 2

	export { type bar, foo }
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	type foo = 1
	type bar = 2

	export { type bar, foo }
	~~~~~~
	\`<script setup>\` cannot contain ES module exports.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	type foo = 1
	type bar = 2

	export { type bar, type foo }
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	type foo = 1
	type bar = 2

	export { type bar, type foo }
	~~~~~~
	\`<script setup>\` cannot contain ES module exports.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	const foo = 1

	export { foo }
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	const foo = 1

	export { foo }
	~~~~~~
	\`<script setup>\` cannot contain ES module exports.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	export { foo } from './fixture'
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	export { foo } from './fixture'
	~~~~~~
	\`<script setup>\` cannot contain ES module exports.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	export * from './fixture'
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	export * from './fixture'
	~~~~~~
	\`<script setup>\` cannot contain ES module exports.
</script>
			`,
		},
		{
			code: `
<script lang="ts">
	export const foo = 1
</script>

<script setup lang="ts">
	import { } from './fixture'
	
	export const bar = 2
</script>
			`,
			fileName,
			snapshot: `
<script lang="ts">
	export const foo = 1
</script>

<script setup lang="ts">
	import { } from './fixture'
	
	export const bar = 2
	~~~~~~
	\`<script setup>\` cannot contain ES module exports.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	export enum foo { a, b }
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	export enum foo { a, b }
	~~~~~~
	\`<script setup>\` cannot contain ES module exports.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	export class foo {}
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	export class foo {}
	~~~~~~
	\`<script setup>\` cannot contain ES module exports.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	export namespace foo {}
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	export namespace foo {}
	~~~~~~
	\`<script setup>\` cannot contain ES module exports.
</script>
			`,
		},
		{
			code: `
<script setup lang="ts">
	export function foo() {}
</script>
			`,
			fileName,
			snapshot: `
<script setup lang="ts">
	export function foo() {}
	~~~~~~
	\`<script setup>\` cannot contain ES module exports.
</script>
			`,
		},
	],
	valid: [
		{
			code: `
<script setup lang="ts">
	const foo = 1
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	export type foo = 1
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	type foo = 1

	export type { foo }
</script>
			`,
			fileName,
		},
		{
			code: `
<script lang="ts">
	export const foo = 1
</script>
			`,
			fileName,
		},
		// second script setup is not checked (it's vue error)
		{
			code: `
<script setup lang="ts">
</script>

<script setup lang="ts">
	export const foo = 1
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	export declare const foo: number
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	export declare enum foo { a, b }
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	export declare class foo {}
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	export declare namespace foo {}
</script>
			`,
			fileName,
		},
		{
			code: `
<script setup lang="ts">
	export declare function foo(): void
</script>
			`,
			fileName,
		},
	],
});
