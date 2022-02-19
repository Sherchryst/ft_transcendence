<template>
	<div class="grid grid-cols-12 place-content-center h-screen">
		<div class="col-start-2 col-span-4 flex flex-col justify-between r-panel px-28 py-36">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">

export default {
}
</script>

<style lang="scss">
.r-panel{
	background: $bg--lg-color;
	border-radius: 25px;
}
</style>
