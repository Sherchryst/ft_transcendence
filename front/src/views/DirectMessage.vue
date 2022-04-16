<template>
	<ChatViewWrapper @callback="send">
		<template v-slot:info>
			
		</template>
		<template v-slot:option>
			
		</template>
		<template v-slot:messages>
			<message v-for="message in history" :key="message" :message="message" :channelId="parseInt(id)">
				{{message.content}}
			</message>
		</template>
	</ChatViewWrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Message from '@/components/chat/Message.vue'
import ChatViewWrapper from '@/components/chat/ChatViewWrapper.vue';
import { DirectMessage } from '@/interfaces/Message';
import { chatSocket } from '@/socket'

export default defineComponent({
	name: 'DirectMessage',
	props: {
		userId: {type: String, required: true}
	},
	data() {
		return {
			socket : chatSocket,
			history: [] as DirectMessage[],
		}
	},
	methods: {
		send(message: string): void {
			console.log("direct message : ", message)
			if (message != "") {
				this.socket.emit('direct_message', {
					towardId: parseInt(this.userId),
					content : message
				});
			}
		},
		recv(data: DirectMessage): void {
			data.self = (this.$store.getters.getId != data.to.id)
			data.photo = !(this.history.length && this.history[0].to.id == data.to.id)
			this.history.unshift(data)
		}
	},
	mounted() {
		this.socket
			.on('direct_message', (data) => {
				console.log("Direct_mesage", data)
				this.recv(data)
			})
	},
	components: { ChatViewWrapper, Message }
})
</script>