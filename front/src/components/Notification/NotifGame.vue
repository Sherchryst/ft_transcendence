<template>
	<div>
		<span class="font-accentuate font-semibold">{{username}}</span> wants to challenge you on <span class="font-accentuate font-semibold">{{ mode }}</span> mode
		<div class="grid grid-cols-2 gap-3 my-2">
			<ButtonLink @click="acceptInvitation">Accept</ButtonLink>
			<ButtonLink @click="declineInvitation" class="btn-neutral">Decline</ButtonLink>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { GameInvitation } from "@/interfaces/Notification";
import ButtonLink from "../ButtonLink.vue";
import { gameSocket } from "@/socket";

export default defineComponent({
	name: 'NotifGame',
	props: {
		data: { type: Object as PropType<GameInvitation>, required: true }
	},
	data() {
		return {
			socket: gameSocket 
		}
	},
	components: { ButtonLink },
	methods: {
		acceptInvitation() {
			this.socket.emit("acceptInvit", this.data);
			this.close()
		},
		declineInvitation() {
			this.socket.emit("declineInvit", this.data);
			this.close()
		},
		close(){
			this.$emit("close", this.invitation)
		}
	},
	computed: {
		invitation(): GameInvitation {
			return (this.data as GameInvitation)
		},
		username(): string {
			return this.data.from.nickname;
		},
		mode(): string {
			return ( (this.invitation.level == 2) ? "Normal" : "Easy")
		},
	},
})
</script>