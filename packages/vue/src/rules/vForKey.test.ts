import path from "node:path";
import rule from "./vForKey.js";
import { ruleTester } from "./ruleTester.js";

const fileName = path.join(import.meta.dirname, "file.vue");

ruleTester.describe(rule, {
	invalid: [
		{
			fileName,
			code: `
<template>
	<template v-for="item in [1, 2]"></template>
</template>
			`,
			snapshot: `
<template>
	<template v-for="item in [1, 2]"></template>
	          ~~~~~
	          Elements using v-for must include a unique :key to ensure correct reactivity and DOM stability.
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div v-for="item in [1, 2]"></div>
</template>
			`,
			snapshot: `
<template>
	<div v-for="item in [1, 2]"></div>
	     ~~~~~
	     Elements using v-for must include a unique :key to ensure correct reactivity and DOM stability.
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div v-for="item in [1, 2]">
		<p></p>
	</div>
</template>
			`,
			snapshot: `
<template>
	<div v-for="item in [1, 2]">
	     ~~~~~
	     Elements using v-for must include a unique :key to ensure correct reactivity and DOM stability.
		<p></p>
	</div>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<template v-for="item in [1, 2]">
		<p></p>
	</template>
</template>
			`,
			snapshot: `
<template>
	<template v-for="item in [1, 2]">
	          ~~~~~
	          Elements using v-for must include a unique :key to ensure correct reactivity and DOM stability.
		<p></p>
	</template>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div>
		<img v-for="item in [1, 2]"/>
	</div>
</template>
			`,
			snapshot: `
<template>
	<div>
		<img v-for="item in [1, 2]"/>
		     ~~~~~
		     Elements using v-for must include a unique :key to ensure correct reactivity and DOM stability.
	</div>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div v-if="true">
		<img v-for="item in [1, 2]"/>
	</div>
</template>
			`,
			snapshot: `
<template>
	<div v-if="true">
		<img v-for="item in [1, 2]"/>
		     ~~~~~
		     Elements using v-for must include a unique :key to ensure correct reactivity and DOM stability.
	</div>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div v-if="true"></div>
	<div v-else>
		<img v-for="item in [1, 2]"/>
	</div>
</template>
			`,
			snapshot: `
<template>
	<div v-if="true"></div>
	<div v-else>
		<img v-for="item in [1, 2]"/>
		     ~~~~~
		     Elements using v-for must include a unique :key to ensure correct reactivity and DOM stability.
	</div>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div v-for="i in [1, 2]" :key="i">
		<img v-for="item in [1, 2]"/>
	</div>
</template>
			`,
			snapshot: `
<template>
	<div v-for="i in [1, 2]" :key="i">
		<img v-for="item in [1, 2]"/>
		     ~~~~~
		     Elements using v-for must include a unique :key to ensure correct reactivity and DOM stability.
	</div>
</template>
			`,
		},
		{
			fileName,
			code: `
<script setup lang="ts">
	declare const key: number
</script>

<template>
	<div 
		v-for="item in ['a', 'b']"
		:key="key"
	></div>
</template>
		},
			`,
			snapshot: `
<script setup lang="ts">
	declare const key: number
</script>

<template>
	<div 
		v-for="item in ['a', 'b']"
		:key="key"
		      ~~~
		      The :key on this v-for element does not reference the iteration variable.
	></div>
</template>
		},
			`,
		},
		{
			fileName,
			code: `
<template>
	<div 
		v-for="(item, i) in ['a', 'b']"
		:key="(i => i)(5)"
	></div>
</template>
		},
			`,
			snapshot: `
<template>
	<div 
		v-for="(item, i) in ['a', 'b']"
		:key="(i => i)(5)"
		      ~~~~~~~~~~~
		      The :key on this v-for element does not reference the iteration variable.
	></div>
</template>
		},
			`,
		},
		{
			fileName,
			code: `
<template>
	<div 
		v-for="(item, key, i) in { foo: 'bar' }"o
		:key="5"
	></div>
</template>
			`,
			snapshot: `
<template>
	<div 
		v-for="(item, key, i) in { foo: 'bar' }"o
		:key="5"
		      ~
		      The :key on this v-for element does not reference the iteration variable.
	></div>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div 
		v-for="item in [1, 2]"
		key=item
	></div>
</template>
			`,
			snapshot: `
<template>
	<div 
		v-for="item in [1, 2]"
		key=item
		    ~~~~
		    Static key values prevent Vue from tracking changes in v-for lists.
	></div>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div 
		v-for="item in [1, 2]"
		key='item'
	></div>
</template>
			`,
			snapshot: `
<template>
	<div 
		v-for="item in [1, 2]"
		key='item'
		     ~~~~
		     Static key values prevent Vue from tracking changes in v-for lists.
	></div>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div 
		v-for="item in [1, 2]"
		key="item"
	></div>
</template>
			`,
			snapshot: `
<template>
	<div 
		v-for="item in [1, 2]"
		key="item"
		     ~~~~
		     Static key values prevent Vue from tracking changes in v-for lists.
	></div>
</template>
			`,
		},
		{
			fileName,
			code: `
<script lang="ts" setup>
	const key = 5
</script>

<template>
	<div 
		v-for="item in [1, 2]"
		:key
	></div>
</template>
			`,
			snapshot: `
<script lang="ts" setup>
	const key = 5
</script>

<template>
	<div 
		v-for="item in [1, 2]"
		:key
		~~~~
		The :key on this v-for element does not reference the iteration variable.
	></div>
</template>
			`,
		},
		{
			fileName,
			code: `
<script lang="ts" setup>
	const key = 5
</script>

<template>
	<div 
		v-for="item in [1, 2]"
		v-bind:key
	></div>
</template>
			`,
			snapshot: `
<script lang="ts" setup>
	const key = 5
</script>

<template>
	<div 
		v-for="item in [1, 2]"
		v-bind:key
		~~~~~~~~~~
		The :key on this v-for element does not reference the iteration variable.
	></div>
</template>
			`,
		},
	],
	valid: [
		{
			fileName,
			code: `
<template>
	<template
		v-for="item in [1, 2]"
		:key="item"
	>
	</template>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div
		v-for="item in [1, 2]"
		:key="item"
	>
	</div>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div
		v-for="item in [1, 2]"
		:key="item"
	>
		<p></p>
	</div>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<template
		v-for="item in [1, 2]"
		:key="item"
	>
		<p></p>
	</template>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div
		v-for="item in [1, 2]"
		:key="item"
		class="foo"
	>
		<p></p>
	</template>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div 
		v-for="/* */ item in ['a', 'b']"
		:key="/* */ item"
	></div>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div 
		v-for="(item, i) in ['a', 'b']"
		:key="i"
	></div>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div 
		v-for="(item, i) in ['a', 'b']"
		:key="'key-' + i"
	></div>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div 
		v-for="({ data }, i) in [{ data: { foo: '123' }}]"
		:key="data.foo"
	></div>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div
		v-for="(item, key, i) in { foo: 'bar' }"
		:key="i"
	></div>
</template>
			`,
		},
		{
			fileName,
			code: `
<template>
	<div
		v-for="n in 10"
		:key="n"
	></div>
</template>
			`,
		},
		// TS error
		{
			fileName,
			code: `
<template>
	<div
		v-for="n in 10"
		key
	></div>
</template>
			`,
		},
		{
			fileName,
			code: `
<script setup lang="ts">
	const key = 5
</script>

<template>
	<div
		v-for="key in 10"
		:key
	></div>
</template>
			`,
		},
		{
			fileName,
			code: `
<script setup lang="ts">
	const key = 5
</script>

<template>
	<div
		v-for="key in 10"
		v-bind:key
	></div>
</template>
			`,
		},
	],
});
