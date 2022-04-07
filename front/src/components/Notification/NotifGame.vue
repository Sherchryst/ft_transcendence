<template>
	<span class="font-accentuate font-semibold">{{username}}</span> wants to challenge you on <span class="font-accentuate font-semibold">{{mapName}}</span>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { GameInvitation } from "@/interfaces/Notifiaction";

export default defineComponent({
	name: 'NotifGame',
	props: {
		data: { type: Object , required: true }
	},
	computed: {
		username(): string {
			return (this.data as GameInvitation).from.nickname;
		},
		mapName(): string {
			return (this.data as GameInvitation).map;
		}
	}
})
</script>