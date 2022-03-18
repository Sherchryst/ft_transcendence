<template>
	<div class="flex-1 largecard w-80 h-32 m-3">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({

})
</script>

<style lang="scss">
.largecard{
	background: $bg--lg-color;
	border-radius: 25px;
}
</style>
