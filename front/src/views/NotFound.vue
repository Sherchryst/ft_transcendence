<template>
	<div class="flex flex-col min-h-screen justify-center">
		<div class="error-number text-9xl font-bold">
			404
		</div>
		<div>
			lost in space
		</div>
		<div class="mt-10">
			<button-link text="Go to home" route="home"></button-link>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue'
import ButtonLink from '../components/ButtonLink.vue'

export default defineComponent({
	name: "NotFound",
	components: { 
		ButtonLink,
	}
	// setup() {
		
	// },
})
</script>

<style lang="scss" scoped>
.error-number{
	color: $dark-font;
}
</style>