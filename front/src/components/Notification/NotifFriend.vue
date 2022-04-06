<template>
	<span class="font-accentuate font-semibold">{{ username }}</span> wants to become your friend
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { FriendRequest } from "@/interfaces/Notifiaction";

export default defineComponent({
	name: 'NotifFriend',
	props: {
		data: { type: Object , required: true }
	},
	computed: {
		username(): string {
			return (this.data as FriendRequest).from;
		}
	}
})
</script>