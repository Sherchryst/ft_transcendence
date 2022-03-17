<template>
	<div class="flex-1 card">
		<slot></slot>
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
}
</style>
