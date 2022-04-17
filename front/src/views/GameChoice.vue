<template>
	<div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-12">
			<game-panel title="Battleground" @click="(evt) => matchmaking()" action_name="Search" class="battleground">
			</game-panel>
			<game-panel @click="sendInvite()" title="Challenge" action_name="Invite" class="challenge">
				<!-- <challenge-form></challenge-form> -->
			</game-panel>
			<game-panel title="Training" @click="requestGame" action_name="Run" class="bot">
				<!-- <ButtonLink text="Bot game" href= /> -->
			</game-panel>
		</div>
		<challenge-modal ref="modal_challenge"></challenge-modal>
	</div>
</template>

<script lang="ts">
import GamePanel from '@/components/game/GamePanel.vue';
// import ChallengeForm from '@/components/chat/game/ChallengeForm.vue';
// import BigRadioButton from '@/components/BigRadioButton.vue';
import { defineComponent } from 'vue';
import { gameSocket, statusSocket } from '@/socket';
import router from '@/router';
import ChallengeModal from '@/components/modal/ChallengeModal.vue';

export default defineComponent({
	components: {
    GamePanel,
    ChallengeModal
},
	methods: {
		sendInvite() {
			(this.$refs["modal_challenge"] as typeof ChallengeModal).open()
			// gameSocket.emit("invite", { login: "cheat_user", mapId: 3, level: 1 });
		},
		requestGame() {
			router.push({ name: "game", params: { match_id: `bot` } })
		},
		matchmaking() {
			gameSocket.emit("matchmaking");
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
