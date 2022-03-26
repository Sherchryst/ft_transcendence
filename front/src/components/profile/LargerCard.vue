<template>
	<div class="largecard flex flex-col justify-around text-left h-32 py-2 px-5">
		<div class="text-xl font-bold">Achievements Title</div>
		<div>
			Lorem ipsum dolor sit amet consectetur adipisicing elit.
		</div>
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
	border-radius: 13px;
	filter: drop-shadow(0px 4px 4px rgba(7, 53, 70, 0.22));
}
</style>
