<template>
	<div class="chan flex flex-row justify-between px-4 py-3">
			<div class="flex flex-col items-start">
				<span class="title font-bold text-xl">#-{{channel?.name}}</span>
				<span class="font-light">Username</span>
			</div>
			<button @click="join">join</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Channel } from '@/interfaces/Channel';
import { API } from '@/scripts/auth';
import { chatSocket } from '@/socket'

export default defineComponent({
	props: {
		channel: {type: Object as PropType<Channel>},
	},
	data() {
		return {
			socket : chatSocket,
		}
	},
	methods: {
		// join(): void {
		// 	this.socket.emit('join', {
        //         channelId: this.channel?.id,
        //         password: ""
        //     });
		// },
		join() {
			API.post("chat/join", {
				channelID: this.channel?.id,
				password: ""
			})
		}
	}
})
</script>

<style lang="scss" scoped>
.chan{
    border-radius: 12px;
    .title{
        color: $dark-font;
    }
    &:hover{
        background: $panel-color;
    }
}
</style>