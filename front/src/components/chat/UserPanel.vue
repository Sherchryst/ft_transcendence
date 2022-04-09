<template>
	<div class="flex flex-col gap-4">
		<button @click="requestFriend">
			Ask a friend
		</button>
		<button @click="block">
			Block
		</button>
		<button @click="challenge">
			challenge
		</button>
		<button @click="mute">
			mute user
		</button>
		<button @click="ban">
			ban user
		</button>
	</div>
</template>

<script lang="ts">
import { Channel, ChannelKey } from '@/interfaces/Channel';
import { User } from '@/interfaces/Profile';
import { defineComponent, inject, PropType } from 'vue';

export default defineComponent({
	name: "Message",
	props: {
		user: { type: Object as PropType<User> },
		channelId: Number
	},
	created() {
		console.log("Channel", this.channelId)
	},
	methods: {
		requestFriend(){
			console.log("Friend")
		},
		block(){
			console.log("Block")
		},
		challenge(){
			console.log("Challange")
		},
		mute(){
			console.log("mute")
		},
		ban(){
			console.log("ban")
		},
	}
})
</script>