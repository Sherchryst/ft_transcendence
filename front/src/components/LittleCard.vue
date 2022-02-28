<template>
	<div class="flex-1 card">
		<slot></slot>
	</div>
</template>

<script lang="ts">
export default {

}
</script>

<style lang="scss">
.card{
	background: $bg--lg-color;
	width: 131px;
	height: 131px;
	border-radius: 25px;
}
</style>
