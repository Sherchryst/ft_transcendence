<template>
	<div>
		<div class="flex flex-rows justify-between  md:space-x-14 flex-wrap sm:ml-12">
			<div class="flex flex-col">
				<h2 v-if='result' class="font-sans text-3xl" style="color: green">Victory</h2>
				<h2 v-else class="font-sans text-3xl" style="color: red">Defeat</h2>
				<p class="-mt-2">{{type}}</p>
			</div>
			<div>
				<div class="flex p-2 flex-rows text-3xl">
					<p>{{first}}</p>
					<h2 class="px-5 font-medium">vs</h2>
					<p>{{second}}</p>
				</div>
			</div>
			<div class="ml-5 text-xl flex flex-rows">
				<h2 class=' pt-3 font-medium'>Username</h2>
				<div class="image ml-4">
				</div>
			</div>
			<div class="flex flex-col">
				<p>Stadium</p>
				<p>DA/TE/MATCH</p>
			</div>
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
.image{
	background-color: lightgrey;
	width: 40px;
	height:40px;
	border-radius: 200px;
}
</style>
