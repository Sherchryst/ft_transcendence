<template>
	<div class="grid grid-cols-12 place-content-center h-screen">
		<div class="col-start-2 col-span-4 flex flex-col justify-between r-panel px-28 py-36">
			<div class="mb-20 text-left">
				<h2 class="font-sans font-bold text-3xl pb-5">L'experience pong, autrement</h2>
				<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid ipsum natus doloribus voluptas praesentium, ut quis nam sit, quam adipisci totam repellendus necessitatibus quas unde expedita. Asperiores impedit maxime labore?</p>
			</div>
			<ButtonLink text="Connection avec 42" route="/42" />
		</div>
	</div>
</template>

<script lang="ts">
import ButtonLink from '@/components/ButtonLink.vue';

export default {
	components: {
		ButtonLink
	}
}
</script>

<style lang="scss">
.r-panel{
	background: $bg--lg-color;
	border-radius: 25px;
}
h2{
	color: $text-title;
}
</style>
