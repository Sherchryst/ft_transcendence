<template>
	<div class="grid grid-cols-12 place-content-center h-screen">
		<div class="col-span-12 md:col-span-10 md:col-start-2 mx-3 lg:mx-0 lg:col-span-5 xl:col-span-4 lg:col-start-2 xl:col-start-2 flex flex-col justify-between r-panel px-6 lg:px-20 2xl:px-28 py-10 lg:py-28">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({

})
</script>

<style lang="scss">
.r-panel{
	box-shadow: 0px 4px 4px rgba(142, 172, 171, 0.31);
	background: $bg--lg-color;
	border-radius: 25px;
}
</style>
