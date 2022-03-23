<template>
	<div class="place-content-between flex flex-col card">
		<div class="mt-3 -mb-3">
			<slot name="title"></slot>
		</div>
		<div class="flex flex-col flex-1 justify-center">
			<slot class="flex-1 items-center" name="body"></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({

})
</script>

<style lang="scss">
.card{
	background: $bg--lg-color;
	width: 131px;
	height: 131px;
	border-radius: 25px;
	filter: drop-shadow(0px 4px 4px rgba(7, 53, 70, 0.22));
}
</style>
