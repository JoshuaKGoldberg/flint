import path from "node:path";

import { ruleTester } from "./ruleTester.js";
import rule from "./scriptSetupExports.js";

ruleTester.describe(rule, {
	invalid: [
		{
			code: `
<script setup lang="ts">
	export const foo = 1
</script>
			`,
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
		`
<script setup lang="ts">
	const foo = 1
</script>
		`,
		`
<script setup lang="ts">
	export type foo = 1
</script>
		`,
		`
<script setup lang="ts">
	type foo = 1

	export type { foo }
</script>
		`,
		`
<script lang="ts">
	export const foo = 1
</script>
		`,
		// second script setup is not checked (it's vue error)
		`
<script setup lang="ts">
</script>

<script setup lang="ts">
	export const foo = 1
</script>
		`,
		`
<script setup lang="ts">
	export declare const foo: number
</script>
		`,
		`
<script setup lang="ts">
	export declare enum foo { a, b }
</script>
		`,
		`
<script setup lang="ts">
	export declare class foo {}
</script>
		`,
		`
<script setup lang="ts">
	export declare namespace foo {}
</script>
		`,
		`
<script setup lang="ts">
	export declare function foo(): void
</script>
		`,
	],
});
