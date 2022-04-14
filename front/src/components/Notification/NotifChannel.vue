<template>
	<span class="font-accentuate font-semibold">{{ username }}</span> has invited you in the channel <span class="font-accentuate font-semibold">#-{{channelName}}</span>
	<div class="grid grid-cols-2 gap-3 my-2">
		<ButtonLink @click="accept">Accept</ButtonLink>
		<ButtonLink @click="close" class="btn-neutral">Decline</ButtonLink>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ChannelInvitation } from "@/interfaces/Notification";
import ButtonLink from '@/components/ButtonLink.vue';

export default defineComponent({
	name: 'NotifChannel',
	props: {
		data: { type: Object as PropType<ChannelInvitation>, required: true }
	},
	methods: {
		accept(){
			console.log("accept")
		},
		close(){
			console.log("close")
			this.$emit("close", this.invitation)
		}
	},
	components: { ButtonLink },
	computed: {
		invitation(): ChannelInvitation {
			return (this.data as ChannelInvitation)
		},
		username(): string {
			return (this.data as ChannelInvitation).from.nickname;
		},
		channelName(): string {
			return (this.data as ChannelInvitation).channel.name;
		}
	},
})
</script>