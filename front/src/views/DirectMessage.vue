<template>
	<ChatViewWrapper @callback="send">
		<template v-slot:info>
			
		</template>
		<template v-slot:option>
			
		</template>
		<template v-slot:messages>
			<message v-for="(message, index) in history" :key="index" :message="message" :channelId="parseInt(userId)">
				{{message.content}}
			</message>
		</template>
	</ChatViewWrapper>
</template>

<script lang="ts">
import { API } from '@/scripts/auth';
import { defineComponent, watch } from 'vue';
import Message from '@/components/chat/Message.vue'
import ChatViewWrapper from '@/components/chat/ChatViewWrapper.vue';
import { DirectMessage, Message_t } from '@/interfaces/Message';
import { chatSocket } from '@/socket'
import { ChannelMember_t, ChannelMemberRole } from '@/interfaces/Channel';

export default defineComponent({
	name: 'DirectMessage',
	props: {
		userId: {type: String, required: true}
	},
	data() {
		return {
			id: parseInt(this.userId),
			socket : chatSocket,
			history: [] as Message_t[],
			member: {
				you: {} as ChannelMember_t,
				friend: {} as ChannelMember_t
			}
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
		init(userId: number): void {
			this.history = []
			API.get('chat/direct-messages', {
				params: {
					to: userId
				}
			}).then( (response) => {
				let messages: DirectMessage[] = response.data
				for (let i = 0; i < messages.length; ++i)
					this.recv(messages[i])
			})
		},
		recv(data: DirectMessage): void {
			let message: Message_t = {
				content: data.message.content,
				from: data.message.from,
				self: false,
				photo: true,
			} 
			if (this.$store.getters.getId == message.from.id)
                message.self = true
            if (this.history.length && this.history[0].from.id == message.from.id)
                message.photo = false
			this.history.unshift(message)
		}
	},
	created(): void {
		watch(
			() => this.$route.params.id,
			(newId) => {
				if (newId)
					this.init(parseInt(String(newId)))
			}
		)
	},
	mounted() {
		this.init(this.id)
		this.socket
			.on('direct_message', (data) => {
				console.log("Direct_mesage", data)
				this.recv(data)
			})
	},
	components: { ChatViewWrapper, Message }
})
</script>