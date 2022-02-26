<template>
	<div class="grid grid-cols-3 gap-12">
		<GamePanel title="Battleground" action_name="Recherche" />
		<game-panel title="Challenge" action_name="Défier">
			<form action="" class="flex flex-col">
				<div class="flex flex-col-reverse mt-4">
					<input class="px-3 py-2" type="text" name="username" id="username">
					<label class="text-left" for="username">Useranme</label>
				</div>
				<div class="flex flex-col items-start mt-10">
					<span>Maps</span>
					<div class="flex flex-row flex-wrap gap-4">
						<big-radio-button id="map-1" />
						<big-radio-button id="map-2" />
						<big-radio-button id="map-3" />
					</div>
				</div>
				<div class="flex flex-col items-start mt-10">
					<span class="mb-1">Bonus</span>
					<switch-button />
				</div>
			</form>
		</game-panel>
		<GamePanel title="Entrainement" action_name="Lancer" />
	</div>
</template>

<script lang="ts">
import GamePanel from '@/components/GamePanel.vue';
import BigRadioButton from '@/components/BigRadioButton.vue';
import SwitchButton from '@/components/SwitchButton.vue';

export default {
	components: {
		GamePanel,
		BigRadioButton,
		SwitchButton,
	},
}
</script>

<style lang="scss" scoped>
form {
	span, input[type=text] ~ label{
		color: $panel--dk-color;;
	}
	input[type=text]{
		border-radius: 10px;
	}
}
</style>