<template>
	<div class="grid grid-cols-4 items-center pb-7">
		<div class="col-span-2 md:col-span-1 text-left flex flex-col">
			<h2 v-if='result' class="victory font-sans font-bold text-3xl">VICTORY</h2>
			<h2 v-else class="defeat font-sans font-bold text-3xl">DEFEAT</h2>
			<p class="font-light">{{type}}</p>
		</div>
		<div class="hidden lg:flex col-span-2 md:col-span-1">
			<div class="flex flex-rows text-3xl">
				<p>{{first}}</p>
				<h2 class="px-5 font-medium">vs</h2>
				<p>{{second}}</p>
			</div>
		</div>
		<div class="col-span-2 md:col-span-1 text-xl flex flex-rows">
			<h2 class=' pt-3 font-medium'>Username</h2>
			<img class="image ml-4 h-14 w-14" src="@/assets/blank-avatar.jpg">
		</div>
		<div class="col-span-2 md:col-span-1 hidden lg:flex flex-col">
			<p>Stadium</p>
			<p>DA/TE/MATCH</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
	result: { type: Boolean, default: false },
	type: String,
	first: Number,
	second: Number
  }
})
</script>

<style lang="scss">
.victory{
	color: $victory-color;
}

.defeat{
	color: $defeat-color;
}

.image{
	background-color: lightgrey;
	width: 40px;
	height:40px;
	border-radius: 200px;
}
</style>
