<style lang="scss" scoped>
.counter {
	border-radius: 25px;
	background-color: $panel-color;
	color: $dark-font;
}
</style>

<template>
	<div class="flex flex-row justify-between items-center">
		<!-- <div class="justify-self-center"> -->
			<slot></slot>
		<!-- </div> -->
		<div class="counter px-3 pt-2 pb-1">
			{{ lenght }}
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name:"TitleCount",
	props: {
		lenght: { type: Number, required: true }
	}

})
</script>