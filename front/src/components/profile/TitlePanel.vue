<template>
	<div class="flex flex-col">
		<div class="flex flew-rows items-center">
			<div class="icon mr-4 w-13">
				<slot></slot>
			</div>
			<div class="title justify-self-start">
				<h2 class="font-bold font-sans text-2xl">{{title}}</h2>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
	title: String
  }
})
</script>

<style lang="scss" scoped>
.icon{
	width: 44px;
	height: 44px;
	border-radius: 25px;
	fill: $secondary-color;
}
.title{
	width: auto;
	height: auto;
	left: 720px;
	top: 171px;
}
h3{
	color: $text-title;
}
</style>
