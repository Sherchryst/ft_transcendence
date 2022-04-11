<template>
	<span class="font-accentuate font-semibold">{{username}}</span> wants to challenge you on <span class="font-accentuate font-semibold">{{mapName}}</span>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { GameInvitation } from "@/interfaces/Notification";
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
	methods: {
		acceptInvitation() {
			this.socket.emit("acceptInvit", this.data);
			console.log("acceptInvit", this.data);
		},
		declineInvitation() {
			this.socket.emit("declineInvit", this.data);
			console.log("declineInvit", this.data);
		},
		// 		gameSocket.on("invited", (data : string) => {
		// 	gameSocket.emit("acceptInvit", data); // TODO: ask for confirmation
		// 	console.log("accepted invite : ", data);
		// });
		// gameSocket.on("gameStart", (data: string) => {
		// 		router.push({ name: "game", params: { match_id: data }})
		// })
	},
	computed: {
		username(): string {
			return this.data.from.nickname;
		},
		mapName(): string {
			// return this.data.map.name;
			return ("")
		}
	}
})
</script>