<template>
	<div class="flex flex-col">
		<div class="flex flew-rows jus">
			<div class="icon">
				<slot></slot>
			</div>
			<div class="title justify-self-start">
				<h2 class="font-sans text-3xl">{{title}}</h2>
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

<style lang="scss">
.icon{
	width: 44px;
	height: 44px;
	border-radius: 25px;
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
