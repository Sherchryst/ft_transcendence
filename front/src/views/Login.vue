<template>
	<single-card-page>
		<div class="mb-20 text-left">
			<main-title class="pb-5">L'experience pong, autrement</main-title>
			<h2 class="font-sans font-bold text-3xl pb-5"></h2>
			<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid ipsum natus doloribus voluptas praesentium, ut quis nam sit, quam adipisci totam repellendus necessitatibus quas unde expedita. Asperiores impedit maxime labore?</p>
		</div>
		<ButtonLink text="Connection avec 42" route="/42" />
	</single-card-page>
</template>

<script lang="ts">
import ButtonLink from '@/components/ButtonLink.vue';
import SingleCardPage from '@/components/SingleCardPage.vue';
import MainTitle from '@/components/MainTitle.vue';

export default {
	components: {
		ButtonLink,
		SingleCardPage,
		MainTitle
	}
}
</script>

<style lang="scss">
</style>
