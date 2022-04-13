<template>
    <div class="flex flex-col">
        <span class="font-accentuate font-semibold">{{username}}</span> wants to challenge you on <span class="font-accentuate font-semibold">{{mapName}}</span>
        <router-link :to="{name: 'game', params: {match_id: data.id}}"><button-link>Game</button-link></router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { GameStart } from "@/interfaces/Notification";
import { gameSocket } from "@/socket";
import ButtonLink from "../ButtonLink.vue";

export default defineComponent({
	name: 'NotifGameStart',
	props: {
		data: { type: Object as PropType<GameStart>, required: true }
	},
	data() {
		return {
			socket: gameSocket 
		}
	},
    components: { ButtonLink },
	computed: {
		username(): string {
			return this.data.from.nickname;
		},
		mapName(): string {
			// return this.data.map;
            return ("")
		}
	}
})
</script>