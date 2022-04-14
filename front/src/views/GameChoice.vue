<template>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-12">
		<game-panel title="Battleground" @action="(evt) => matchmaking()" action_name="Search">
		</game-panel>
		<game-panel @action="sendInvite()" title="Challenge" action_name="Invite">
			<!-- <form action="" class="flex flex-col">
				<div class="flex flex-col-reverse mt-4">
					<input class="px-3 py-2" type="text" name="username" id="username">
					<label class="text-left" for="username">Username</label>
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
			</form> -->
		</game-panel>
		<game-panel title="Training" @action="requestGame" action_name="Run">
			<!-- <ButtonLink text="Bot game" href= /> -->
		</game-panel>
	</div>
</template>

<script lang="ts">
import GamePanel from '@/components/GamePanel.vue';
// import BigRadioButton from '@/components/BigRadioButton.vue';
import { defineComponent } from 'vue';
import { gameSocket } from '@/socket';
import router from '@/router';

export default defineComponent({
	components: {
		GamePanel,
		// BigRadioButton,
	},
	beforeUnmount() {
		//   gameSocket.off("invited");
		//   gameSocket.off("gameStart");
		// const removed = document.removeEventListener("mousemove", this.moveRackets);
		console.log("before destroy in gamechoice");
	},
	methods: {
		sendInvite() {
			gameSocket.emit("invite", { nickname: "cheater", mapId: 3, level: 1 });
		},
		requestGame() {
			router.push({ name: "game", params: { match_id: `bot` } })
			console.log("BOT");
		},
		matchmaking() {
			gameSocket.emit("matchmaking");
			console.log("matchmaking")
		}
	}
})
</script>

<style lang="scss" scoped>
form {

	span,
	input[type=text]~label {
		color: $panel--dk-color;
		;
	}

	input[type=text] {
		border-radius: 10px;
	}
}
</style>
