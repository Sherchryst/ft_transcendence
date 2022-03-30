<template>
	<div class="lg-card flex flex-col justify-around text-left h-32 py-2 px-5">
		<div class="lg-card-title text-xl font-bold">Achievements Title</div>
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
.lg-card{
	background: $bg--lg-color;
	border-radius: 13px;
	filter: drop-shadow(0px 4px 4px rgba(7, 53, 70, 0.22));
	&-title{
		color: $dark-font;
	}
	&-inactive{
		background: #dfdfdf;
		color: lighten($color: $dark-font, $amount: 60%);
		filter: unset;
		.lg-card-title{
			color: lighten($color: $dark-font, $amount: 40%);
		}
	}
}
</style>
