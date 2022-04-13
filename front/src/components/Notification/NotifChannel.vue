<template>
	<span class="font-accentuate font-semibold">{{ username }}</span> has invited you in the channel <span class="font-accentuate font-semibold">#-{{channelName}}</span>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ChannelInvitation } from "@/interfaces/Notification";

export default defineComponent({
	name: 'NotifChannel',
	props: {
		data: { type: Object , required: true }
	},
	computed: {
		username(): string {
			return (this.data as ChannelInvitation).from.nickname;
		},
		channelName(): string {
			return (this.data as ChannelInvitation).channel.name;
		}
	}
})
</script>