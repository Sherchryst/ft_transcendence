<template>
	<div>
		<span class="font-accentuate font-semibold">{{username}}</span> wants to challenge you on <span class="font-accentuate font-semibold">{{mapName}}</span>
		<div class="grid grid-cols-2 gap-3 my-2">
			<ButtonLink @click="acceptInvitation">Accept</ButtonLink>
			<ButtonLink @click="close" class="btn-neutral">Decline</ButtonLink>
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
			console.log("acceptInvit", this.data);
			this.close()
		},
		declineInvitation() {
			// this.socket.emit("declineInvit", this.data);
			console.log("declineInvit", this.data);
			this.close()
		},
		close(){
			this.$emit("close", this.invitation)
		}
		// 		gameSocket.on("invited", (data : string) => {
		// 	gameSocket.emit("acceptInvit", data); // TODO: ask for confirmation
		// 	console.log("accepted invite : ", data);
		// });
		// gameSocket.on("gameStart", (data: string) => {
		// 		router.push({ name: "game", params: { match_id: data }})
		// })
	},
	computed: {
		invitation(): GameInvitation {
			return (this.data as GameInvitation)
		},
		username(): string {
			return this.data.from.login;
		},
		mapName(): string {
			// return this.data.map.name;
			return ("Centurion")
		},
	},
})
</script>